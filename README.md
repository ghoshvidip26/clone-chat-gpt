# 🌐 ChatGPT Clone

A modern ChatGPT clone built with **Next.js** and **TypeScript**, featuring an intuitive chat interface, image analysis capabilities, voice input, and message editing. The app uses OpenRouter API for chat and Gemini for image analysis, providing a comprehensive AI chat experience similar to ChatGPT.

## ✨ Key Features

- 🤖 **Advanced AI Chat**: Powered by OpenRouter API for natural conversations
- �️ **Image Analysis**: Upload and analyze images using Google's Gemini model
- 🎤 **Voice Input**: Built-in speech-to-text for hands-free chatting
- ✏️ **Message Editing**: Edit sent messages with context-aware AI responses
- � **Chat Persistence**: Local storage for chat history
- 🎨 **ChatGPT-like UI**: Dark theme with modern, responsive design
- � **Responsive Layout**: Works seamlessly on desktop and mobile

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm/yarn
- OpenRouter API key
- Cloudinary account

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/ghoshvidip26/clone-chat-gpt.git
cd clone-chat-gpt
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## �️ Technical Details

### API Routes

#### `/api/chat`

- **Method**: `POST`
- **Description**: Handles chat messages and image analysis
- **Features**:
  - Text chat using OpenRouter API
  - Image analysis using Gemini model
  - Context-aware responses
  - Support for message history

#### `/api/upload`

- **Method**: `POST`
- **Description**: Handles image uploads to Cloudinary
- **Features**:
  - Secure file upload
  - Image optimization
  - Multiple format support

---

## � Feature Details

### 💬 Chat Interface

- Real-time AI responses
- Markdown support for rich text
- Message timestamps
- Loading indicators
- Persistent chat history
- Context-aware conversations

### 📸 Image Analysis

- Drag & drop upload
- Preview functionality
- AI-powered image analysis
- Multiple format support
- Cloudinary integration

### 🎤 Voice Input

- Real-time speech-to-text
- Microphone status indicator
- Voice input toggle
- Seamless integration with chat

### ✏️ Message Editing

- Edit sent messages
- Real-time preview
- Context preservation
- Edit history tracking
- Automatic AI response updates

### 🎨 UI/UX Features

- ChatGPT-like dark theme
- Smooth animations
- Responsive design
- Keyboard shortcuts
- Visual feedback

## 📁 Project Structure

```
src/
  ├── app/
  │   ├── api/
  │   │   ├── chat/     # Chat endpoints
  │   │   └── upload/   # Image upload
  │   ├── components/
  │   │   ├── BotMessage.tsx
  │   │   ├── UserMessage.tsx
  │   │   ├── Upload.tsx
  │   │   └── Microphone.tsx
  │   ├── utils/        # Utility functions
  │   ├── layout.tsx
  │   └── page.tsx
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)

## 🙏 Credits

- UI/UX inspired by OpenAI's ChatGPT
- Icons from react-icons
- AI powered by OpenRouter API and Google Gemini

## 👨‍💻 Author

Vidip Ghosh

- GitHub: [@ghoshvidip26](https://github.com/ghoshvidip26)
- **ReadableStream:** This creates a stream of data that is sent back to the client incrementally.
- **Controller:** Manages the flow of the stream and pushes chunks of data (GPT-4 responses) as they're generated.
- **Event format:** Each SSE message is prefixed with `data:` followed by the message content.

SSE is ideal for this use case as it provides:

- Low latency for real-time updates.
- Efficient one-way communication from the server to the client.
- A persistent connection that keeps streaming until the server closes it.

---

## 🖥️ Usage

1. Input messages into the chat interface.
2. Submitting a message sends a request to `/api/chat` and initiates real-time streamed responses from GPT-4 using SSE.
3. Responses are displayed in the chat window, which auto-scrolls to the latest message.
4. Chat history is stored in the component’s local state for the session.

---

## 🛠️ Components Overview

- **`page.tsx`**: Main chat interface component. Manages user input, chat history, and message sending.
- **API Route**: Handles communication with GPT-4 API, streams responses back to the client.

---

## 🧰 Technologies

- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: Adds type safety to JavaScript for more robust code.
- **NextUI**: Modern component library for responsive design.

## 📄 License

This project is licensed under the **MIT License**.
