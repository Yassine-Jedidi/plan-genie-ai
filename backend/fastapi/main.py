from fastapi import FastAPI, Body
import torch
import spacy
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForTokenClassification, AutoModelForSequenceClassification
from pydantic import BaseModel

# Define input model


class TextInput(BaseModel):
    text: str


# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Vous pouvez restreindre ceci à votre frontend spécifique
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get base directory
base_dir = Path(__file__).parent.absolute()

# Try to load models with proper paths for Windows
try:
    # Convert paths to strings with forward slashes
    tokenizer_path = str(base_dir / "camembert" /
                         "camembert-taches-tokenizer").replace("\\", "/")
    ner_model_path = str(base_dir / "camembert" /
                         "camembert-taches-ner-final").replace("\\", "/")
    type_model_path = str(base_dir / "camembert" /
                          "camembert-taches-type-final").replace("\\", "/")

    print(f"Loading tokenizer from: {tokenizer_path}")
    print(f"Loading NER model from: {ner_model_path}")
    print(f"Loading type model from: {type_model_path}")

    # Load models
    tokenizer = AutoTokenizer.from_pretrained(
        tokenizer_path, local_files_only=True)
    ner_model = AutoModelForTokenClassification.from_pretrained(
        ner_model_path, local_files_only=True)
    type_model = AutoModelForSequenceClassification.from_pretrained(
        type_model_path, local_files_only=True)

except Exception as e:
    print(f"Error loading models: {e}")
    # Fallback to load from HuggingFace
    print("Attempting to load models from HuggingFace Hub")
    tokenizer = AutoTokenizer.from_pretrained("camembert-base")
    ner_model = AutoModelForTokenClassification.from_pretrained(
        "camembert-base")
    type_model = AutoModelForSequenceClassification.from_pretrained(
        "camembert-base")

# Load spaCy for tokenization
nlp = spacy.load('fr_core_news_lg')

# Set device (CPU or GPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
ner_model = ner_model.to(device)
type_model = type_model.to(device)

# Retrieve label mappings
id2label = ner_model.config.id2label
id2type = type_model.config.id2label


@app.get("/")
def root():
    return {"message": "FastAPI NLP Model is running!"}


@app.post("/predict-type/")
async def predict_type(input_data: TextInput):
    text = input_data.text
    inputs = tokenizer(text, return_tensors="pt",
                       truncation=True, padding=True).to(device)
    with torch.no_grad():
        outputs = type_model(**inputs)

    predicted_class_id = outputs.logits.argmax().item()
    predicted_type = id2type[predicted_class_id]
    confidence = torch.softmax(outputs.logits, dim=1).max().item()

    return {"type": predicted_type, "confidence": confidence}


@app.post("/extract-entities/")
async def extract_entities(input_data: TextInput):
    text = input_data.text
    doc = nlp(text)
    tokens = [token.text for token in doc]

    inputs = tokenizer(tokens, is_split_into_words=True,
                       return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        outputs = ner_model(**inputs)

    predictions = outputs.logits.argmax(dim=2)
    entities = {}
    current_entity = None
    current_text = []

    word_ids = inputs.word_ids(0)
    for idx, word_idx in enumerate(word_ids):
        if word_idx is None:
            continue
        if idx > 0 and word_ids[idx-1] == word_idx:
            continue

        prediction = predictions[0, idx].item()
        predicted_label = id2label[prediction]

        if predicted_label.startswith("B-"):
            if current_entity:
                entity_type = current_entity[2:]
                if entity_type not in entities:
                    entities[entity_type] = []
                entities[entity_type].append(" ".join(current_text))

            current_entity = predicted_label
            current_text = [tokens[word_idx]]

        elif predicted_label.startswith("I-") and current_entity and predicted_label[2:] == current_entity[2:]:
            current_text.append(tokens[word_idx])

        else:
            if current_entity:
                entity_type = current_entity[2:]
                if entity_type not in entities:
                    entities[entity_type] = []
                entities[entity_type].append(" ".join(current_text))
                current_entity = None
                current_text = []

    if current_entity:
        entity_type = current_entity[2:]
        if entity_type not in entities:
            entities[entity_type] = []
        entities[entity_type].append(" ".join(current_text))

    return {"entities": entities}


@app.post("/analyze-text/")
async def analyze_text(input_data: TextInput):
    type_result = await predict_type(input_data)
    text_type = type_result["type"]
    confidence = type_result["confidence"]
    entities = (await extract_entities(input_data))["entities"]

    return {
        "type": text_type,
        "confidence": confidence,
        "entities": entities
    }
