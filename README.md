# Rice Leaf Disease Detection AI 🌾

![Rice Leaf Disease Detection UI](public/home.png)

## Overview
**Rice Leaf Disease Detection AI** is a web-based application built to help farmers and agricultural professionals instantly diagnose rice plant diseases. By simply uploading a photo of a rice leaf, the system utilizes a powerful deep learning backend to classify the health of the plant and provide actionable agricultural advice.

**Developed by:** Mark Joseph Potot

## Features
- **AI-Powered Analysis**: Upload images of rice leaves to instantly get a disease prediction using an integrated FastAPI prediction server.
- **Actionable Advice**: Once a disease is detected, the app provides detailed information, prevention methods, and treatment strategies to mitigate crop damage.
- **Detailed Confidence Metrics**: A visual side-panel displays the prediction confidence across various disease classes (e.g., Brown Spot, Leaf Blast, Bacterial Leaf Blight, Rice Hispa).
- **Responsive UI**: A modern, glass-morphic, and fully responsive user interface built for both desktop and mobile devices.
- **Guided Tutorial**: An interactive, step-by-step UI tour to help first-time users navigate the application.

## Tech Stack
- **Frontend Framework**: React + Vite
- **Styling**: Vanilla CSS (Mobile-first responsive design, modern glassmorphism UI)
- **Icons**: Lucide React
- **Backend API**: FastAPI (expected on `localhost:8000/predict` by default)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Install the frontend dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. *(Note: Ensure your Python/FastAPI prediction server is running locally or properly configured in your `.env` file to process the image requests).*
