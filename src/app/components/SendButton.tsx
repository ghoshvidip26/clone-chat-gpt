"use client";
import { FaArrowUp } from "react-icons/fa";

const SendButton = () => {
  return (
    <div>
      <button
        type="submit"
        className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md border-2 border-indigo-500/40 bg-indigo-600 hover:scale-105 shadow-indigo-500/40"
      >
        <FaArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SendButton;
