from pathlib import Path
from huggingface_hub import HfApi
from transformers import AutoTokenizer, AutoModelForTokenClassification, AutoModelForSequenceClassification

# Initialize the Hugging Face API
api = HfApi()

# Get base directory
base_dir = Path(__file__).parent.absolute()

# Define model paths
tokenizer_path = str(base_dir / "models" / "tasks-tokenizer")
ner_model_path = str(base_dir / "models" / "tasks-ner")
type_model_path = str(base_dir / "models" / "tasks-type")

# Define your Hugging Face username (replace with your username)
username = "YassineJedidi"

# Upload tokenizer
print(f"Uploading tokenizer from {tokenizer_path}...")
tokenizer = AutoTokenizer.from_pretrained(
    tokenizer_path, local_files_only=True)
tokenizer.push_to_hub(f"{username}/tasks-tokenizer")
print("Tokenizer uploaded successfully!")

# Upload NER model
print(f"Uploading NER model from {ner_model_path}...")
ner_model = AutoModelForTokenClassification.from_pretrained(
    ner_model_path, local_files_only=True)
ner_model.push_to_hub(f"{username}/tasks-ner")
print("NER model uploaded successfully!")

# Upload type model
print(f"Uploading type model from {type_model_path}...")
type_model = AutoModelForSequenceClassification.from_pretrained(
    type_model_path, local_files_only=True)
type_model.push_to_hub(f"{username}/tasks-type")
print("Type model uploaded successfully!")

print("All models have been uploaded to Hugging Face Hub!")
