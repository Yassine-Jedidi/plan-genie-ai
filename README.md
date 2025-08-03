# Plan Genie AI

<div align="center">
  <img src="https://img.shields.io/badge/Plan%20Genie%20AI-Intelligent%20Task%20Management-blue?style=for-the-badge&logo=react" alt="Plan Genie AI Banner" />
</div>

<div align="center">
  <h3>🤖 AI-Powered Task & Event Management</h3>
  <p>Transform your daily planning with intelligent NLP, speech recognition, and data visualization</p>
</div>

---

An intelligent application designed to assist users in managing daily tasks and events using advanced AI technologies. This project integrates Natural Language Processing (NLP), speech recognition, data visualization, and Google's Gemini AI to automate task generation, intelligent prioritization, event planning, and performance tracking.

---

## 🚀 Features

### **Data Import**

- [✓] **Text Notes**: Allow users to input information via text.
- [✓] **Voice Messages**: Convert voice recordings to text using speech recognition (Hugging Face Transformers).

### **Data Processing & NLP**

- [✓] **Entity Extraction**: Identify priorities, deadlines, dates, and contexts using NLP (spaCy and Hugging Face Transformers).
- [✓] **Task Classification**: Automatically categorize tasks and events into logical groups.
- [✓] **Multilingual Support**: Process inputs in multiple languages.

### **Task & Event Management**

- [✓] **Automatic Task Generation**: Create organized task lists with priorities and deadlines.
- [✓] **Intelligent Task Prioritization**: Leverage Google's Gemini AI to intelligently prioritize tasks based on context, deadlines, and user preferences.
- [✓] **Calendar Integration**: Sync extracted events with an interactive calendar.
- [✓] **Manual Adjustments**: Allow users to modify generated tasks/events.

### **Performance Tracking**

- [✓] **Daily Reports**: Generate summaries of completed activities and performance metrics.
- [✓] **Interactive Charts**: Visualize task completion, deadlines, and time allocation (Recharts).
- [✓] **Time Distribution Analysis**: Provide statistics on time spent across activities.

### **Notifications & Reminders**

- [✓] **Custom Alerts**: Notify users about upcoming deadlines and high-priority tasks.

### **User Interface**

- [✓] **Responsive Web App**: Built with React.js and TypeScript.
- [✓] **Mobile App**: Built with React Native.
- [✓] **Multilingual UI**: Support multiple interface languages.

### **Security & Compliance**

- [✓] **Data Encryption**: Secure sensitive user data.
- [✓] **GDPR Compliance**: Ensure adherence to data protection regulations.

---

## 🛠️ Technologies Used

**Backend**

- Node.js (Express.js) - Main backend API
- Python (FastAPI) - Hugging Face Space
- PostgreSQL (via Prisma ORM) - Structured Data
- Supabase - Authentication and database

**Frontend**

- React.js with TypeScript - Web application
- Vite - Build tool
- Tailwind CSS - Styling
- Shadcn - Reusable Components

**AI/ML**

- Google Gemini AI - Intelligent task prioritization and contextual understanding
- Groq - Whisper for speech-to-text processing
- Hugging Face Transformers
- CamemBERT - French language model (NLP Model) - Extract entities and classify text

**Data Visualization**

- Shadcn Charts - Interactive charts and analytics

**Additional Libraries**

- Framer Motion - Animations
- React Router - Navigation
- i18next - Internationalization
- React Hook Form - Form handling
- Zod - Schema validation

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Yassine-Jedidi/plan-genie-ai.git

# Install backend dependencies
cd backend/express
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

## 🚀 Getting Started

```bash
# Start the backend server
cd backend/express
npm start

# Start the frontend development server
cd ../../frontend
npm run dev
```

## 🌐 Live Demo

The application is deployed and available at: [Plan Genie AI](https://plan-genie-ai.vercel.app)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
