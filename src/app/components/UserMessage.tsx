import { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import { motion } from "framer-motion";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

interface UserMessageProps {
  message: {
    id: string;
    text: string;
    imageUrl?: string;
    isEditing?: boolean;
  };
  onEdit?: (id: string) => void;
  onSaveEdit?: (id: string, newText: string) => void;
}

const UserMessage = ({ message, onEdit, onSaveEdit }: UserMessageProps) => {
  const [editText, setEditText] = useState(message.text);
  const [displayText, setDisplayText] = useState(message.text);
  const date = new Date();

  // Update displayText when message.text changes
  useEffect(() => {
    setDisplayText(message.text);
  }, [message.text]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full my-3 items-start justify-end gap-3"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="inline-block rounded-lg bg-gray-700 p-4 text-lg text-gray-100 max-w-[75%] break-words shadow-sm relative group"
      >
        {message.imageUrl && (
          <div className="mb-3">
            <img
              src={message.imageUrl}
              alt="Uploaded content"
              className="max-w-full rounded-lg shadow-md"
            />
          </div>
        )}
        {message.isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 text-gray-200 bg-[#40414f] rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-600"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDisplayText(editText);
                  onSaveEdit?.(message.id, editText);
                }}
                className="p-1.5 bg-[#19c37d] rounded-lg hover:bg-[#1a7f4e] transition-colors"
              >
                <FiCheck size={16} />
              </button>
              <button
                onClick={() => onEdit?.(message.id)}
                className="p-1.5 bg-[#ef4146] rounded-lg hover:bg-[#dc2626] transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {displayText}
            <button
              onClick={() => onEdit?.(message.id)}
              className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            >
              <FiEdit2 size={14} className="text-white" />
            </button>
          </>
        )}
        <div className="text-right mt-2">
          <span className="text-xs text-white/80">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </motion.div>

      <div className="flex justify-center items-center w-8 h-8 bg-[#5437DB] rounded-sm">
        <CiUser size={20} className="text-white" />
      </div>
    </motion.div>
  );
};

export default UserMessage;
