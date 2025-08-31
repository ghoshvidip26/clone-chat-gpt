import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";

interface UploadProps {
  onImageUpload?: (imageUrl: string) => void;
  onReset?: (resetFn: () => void) => void;
}

export default function Upload({ onImageUpload, onReset }: UploadProps) {
  const uploadStagedFile = async (stagedFile: File | Blob) => {
    try {
      const form = new FormData();
      form.set("file", stagedFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const data = await uploadRes.json();
      const imgURL = data.imgUrl;
      setImgUrl(imgURL);
      onImageUpload?.(imgURL);
    } catch (error) {
      console.error("Upload error:", error);
      // You could add error UI feedback here
    }
  };

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStagedFile(file);
      setPreview(URL.createObjectURL(file));
      uploadStagedFile(file);
    }
  };

  const resetState = () => {
    setStagedFile(null);
    setPreview(null);
    setImgUrl(null);
    onImageUpload?.(""); // Clear the image URL in parent
  };

  // Use resetState in handleRemove
  const handleRemove = () => {
    resetState();
  };

  // Expose resetState through onReset prop
  useEffect(() => {
    if (onReset) {
      onReset(resetState);
    }
  }, []);

  return (
    <>
      {preview ? (
        <div className="relative w-64 h-40 rounded-xl overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-full h-full rounded-xl"
          />
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            &#10006;
          </button>
          <button
            className="absolute top-2 left-2 bg-white rounded-full p-1 shadow"
            aria-label="Edit image"
            // Add edit logic here if needed
          >
            &#9998;
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-10 h-10 border-2 border-dashed rounded-lg cursor-pointer"
        >
          <FaUpload className="w-12" />
          <input
            onChange={handleFileChange}
            id="file-upload"
            type="file"
            className="hidden"
          />
        </label>
      )}
    </>
  );
}
