<h1 align="center">Master your material with a unique, hand-drawn interactive quiz experience.</h1>

<p align="center">
  <img src="docs/assets/hero-screenshot.png" alt="Quizowisko Hero Screenshot" width="800">
</p>

---

## Key Features

- **Personalized Learning:** Upload your own custom question sets to tailor your study sessions exactly to your needs.
- **Engaging Visual Experience:** A beautiful, hand-drawn interface designed to reduce digital fatigue and make studying more inviting.
- **Fluid Interactivity:** Experience smooth, responsive transitions that keep your focus on the material, not the interface.
- **Instant Feedback:** Track your progress in real-time with visual indicators of correct and incorrect answers.
- **Versatile Access:** Whether you're in light or dark mode, the application adapts to your preferred environment for optimal comfort.

## Question File Format

To practice with your own material, simply provide a JSON file containing your questions and answers.

### Example JSON Structure

```json
[
  {
    "question": "What is the capital of France?",
    "answers": [
      { "text": "Berlin", "isCorrect": false },
      { "text": "Paris", "isCorrect": true },
      { "text": "Madrid", "isCorrect": false },
      { "text": "Rome", "isCorrect": false }
    ]
  }
]
```

## Getting Started

### Prerequisites

The application requires the **Bun** runtime to be installed on your system.

### Running Locally

To launch the application in development mode:

```bash
bun install

bun dev
```

Open your browser to the URL displayed in your terminal (`http://localhost:3000`).
