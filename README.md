# Healthcare Assistant Chatbot

This project is a sophisticated AI-powered healthcare chatbot designed to provide general health information and answer user queries in a conversational manner. It's built with a modern tech stack and features a clean, professional, and accessible user interface.

This project was developed as part of the K-HUB 2025-26 Batch recruitment challenge.

## Features

-   **AI-Powered Chat:** Integrates with the Google Gemini API to provide accurate and helpful responses to healthcare-related questions.
-   **Real-time Streaming:** Responses from the AI are streamed in real-time for a more dynamic user experience.
-   **Chat History:** All conversations are automatically saved to the browser's local storage. Users can view, select, and delete past chat sessions.
-   **Theme Toggle:** Switch between a light and dark theme, with the preference saved locally.
-   **Responsive Design:** The interface is fully responsive and works beautifully on devices of all sizes.
-   **Welcome Screen:** A user-friendly welcome screen with suggestion prompts to help users get started.
-   **Professional UI:** A clean and modern interface inspired by the provided design, focusing on accessibility and user experience.

## Tech Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Integration:** Google Gemini API (`@google/genai`)
-   **State Management:** React Hooks
-   **Persistence:** Browser Local Storage

## Project Setup

To run this project locally, you'll need a development environment with Node.js and npm installed.

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    This project uses `npm` as the package manager.
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    The application requires a Google Gemini API key to function.

    *   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Create a new file named `.env` in the root of your project folder.
    *   Add your API key to the `.env` file like this:
        ```
        # For Vite/Create-React-App, prefix with VITE_ or REACT_APP_
        VITE_API_KEY=YOUR_GEMINI_API_KEY
        ```
    *Note: The project's code expects the API key to be available as `process.env.API_KEY`. A build tool like Vite or Create React App is required to make this environment variable accessible in the browser. You may need to adjust the code (`services/geminiService.ts`) to read `import.meta.env.VITE_API_KEY` for Vite.*

4.  **Run the development server:**
    If you are using a standard React setup like Vite, you can run:
    ```bash
    npm run dev
    ```
    This will start the application, and you can view it in your browser at `http://localhost:5173` (or another port specified by your development tool).

## Usage Guide

-   **Starting a Chat:** Click the `+ New Chat` button in the sidebar or select one of the suggestion prompts on the welcome screen.
-   **Sending a Message:** Type your health-related question in the input box at the bottom of the chat window and press Enter or click the send button.
-   **Managing History:**
    -   Previous chats are listed in the sidebar under "Chat History".
    -   Click on a chat to view the conversation.
    -   Hover over a chat and click the trash can icon to delete it.
-   **Changing Theme:** Use the sun/moon toggle switch in the sidebar to alternate between light and dark modes.
-   **Disclaimer:** Please remember that this chatbot provides general health information for educational purposes only and is not a substitute for professional medical advice.

## Submission Deliverables

-   **Source Code:** A complete zip file of the source code.
-   **Explanation Video:** A link to a YouTube video explaining the task.
-   **GitHub Repository:** A public GitHub repository link containing the project and this README file.
