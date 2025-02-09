# Presenter.ai - Real-Time AI Speech Coaching

## Overview
Presenter.ai is an AI-powered real-time speech coaching tool that listens to a presenter and provides live feedback on key aspects of their speech, including pacing, filler words, and clarity. Designed to help speakers improve their delivery, this tool offers instant insights to refine public speaking skills.

## Features
- 🎙 **Real-Time Feedback** – Get instant insights while speaking.
- ⏳ **Pacing Analysis** – Detect if you're speaking too fast or too slow.
- 🔄 **Filler Word Detection** – Identify and minimize "um," "uh," and other fillers.
- 🗣 **Clarity Insights** – Receive feedback on articulation and speech patterns.
- 🌐 **Web-Based Interface** – No installation required; run directly in the browser.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Real-Time Communication**: Socket.IO

## Installation

### Clone the Repository
Clone the repo to your local machine:
```bash
git clone https://github.com/RichardZhang06/Presenter.AI.git
cd Presenter.AI

cd backend
npm install express socket.io cors openai

cd frontend
npm install react react-router-dom
```
### Run the Website
Run backend:
```bash
cd backend
node server.js
```
Run frontend:
```bash
cd frontend
npm start
```

## Usage
Insert your OpenAI API key into ./backend/server.js.\
Open the web app in your browser.\
Grant microphone permissions when prompted.\
Start speaking and receive real-time AI-driven feedback on pacing, filler words, and clarity.

### Contributing
We welcome contributions! Feel free to fork the repo, submit pull requests, or open issues.
