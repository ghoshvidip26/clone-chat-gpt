"use client";
interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp?: number;
  imageUrl?: string;
  isEditing?: boolean;
}

import { useState, useRef, useEffect } from "react";
import { handleResponse } from "./utils/utils";
import { useChatMessageContext } from "./context/context";
import UserMessage from "./components/UserMessage";
import BotMessage from "./components/BotMessage";
import TypingIndicator from "./components/TypingIndicator";
import Microphone from "./components/Microphone";
import { useSpeechToText } from "./utils/SpeechRecognition";
import SendButton from "./components/SendButton";
import Upload from "./components/Upload";

export default function Home() {
  const [micError, setMicError] = useState<string | null>(null);
  const { transcript, listening, volume, toggleRecording } = useSpeechToText({
    setText: () => {},
    setIsRecording: () => {},
  });
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useChatMessageContext();
  const [newMessage, setNewMessage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        localStorage.removeItem("chatHistory");
      }
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const uploadResetRef = useRef<(() => void) | undefined>();

  const handleEditMessage = (id: string) => {
    setMessages((prev: Message[]) =>
      prev.map((msg: Message) =>
        msg.id === id ? { ...msg, isEditing: !msg.isEditing } : msg
      )
    );
  };

  const handleSaveEdit = async (id: string, newText: string) => {
    // First update the message text
    setMessages((prev: Message[]) =>
      prev.map((msg: Message) =>
        msg.id === id ? { ...msg, text: newText, isEditing: false } : msg
      )
    );

    // Find the edited message and its index
    const editedMsgIndex = messages.findIndex((msg: Message) => msg.id === id);
    if (editedMsgIndex === -1) return;

    // Remove all messages after the edited one
    const newMessages = messages.slice(0, editedMsgIndex + 1);
    setMessages(newMessages);

    // Get a new response based on the edited message
    setIsTyping(true);
    try {
      const response = await handleResponse(
        newText,
        messages[editedMsgIndex].imageUrl
      );
      const botMsg: Message = {
        id: Date.now().toString(),
        from: "bot",
        text: response,
        isEditing: false,
      };
      setMessages((prev: Message[]) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error getting new response:", error);
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: "bot",
          text: "Error getting response. Please try again!",
          isEditing: false,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      text: newMessage,
      imageUrl: currentImage,
      isEditing: false,
    };
    setMessages((prev: Message[]) => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);

    // Reset the upload component state
    uploadResetRef.current?.();
    setCurrentImage("");

    try {
      const response = await handleResponse(newMessage, currentImage);
      console.log("AI Response:", response);
      const botMsg: Message = {
        id: Date.now().toString(),
        from: "bot",
        text: response,
        isEditing: false,
      };
      const messages: Message[] = [userMsg, botMsg];

      setMessages((prev: Message[]) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Error fetching AI response:", err);
      setMessages((prev: Message[]) => [
        ...prev,
        { from: "bot", text: "Error fetching data. Please try again!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#343541]">
      <div className="flex flex-col items-center justify-center w-3/5 h-[80vh]">
        <div className="flex-1 w-full">
          <div className="h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 bg-[#343541]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-gray-400 text-center text-5xl">
                  What's on the agenda today?
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg: Message, index: number) => (
                  <div key={`msg-${index}`} className="relative">
                    {msg.from === "user" ? (
                      <UserMessage
                        message={msg}
                        onEdit={handleEditMessage}
                        onSaveEdit={handleSaveEdit}
                      />
                    ) : (
                      <BotMessage botMessage={msg.text} />
                    )}
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
              </>
            )}
          </div>
        </div>
        <div className="w-full mt-4 flex justify-between items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center w-full bg-[#40414f] rounded-xl shadow-xl border border-gray-600/40"
          >
            <Upload
              onImageUpload={setCurrentImage}
              onReset={(resetFn: () => void) => {
                uploadResetRef.current = resetFn;
              }}
            />
            <input
              autoFocus
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 bg-transparent text-white text-lg px-3 py-4 w-full focus:outline-none placeholder-gray-400"
              disabled={false}
            />
            <div className="flex items-center p-2">
              {micError && (
                <span className="ml-2 text-xs text-red-400">{micError}</span>
              )}
              <Microphone />
              <SendButton />
            </div>
          </form>
          <button
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm"
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("chatHistory");
            }}
          >
            Clear chat
          </button>
        </div>
      </div>
    </main>
  );
}
