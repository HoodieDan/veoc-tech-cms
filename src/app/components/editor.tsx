"use client";
import React from "react";
import EditorToolbar, { modules, formats } from "./editor_custom_toolbar";
import "react-quill/dist/quill.snow.css";
// Removed Redux imports: useDispatch, useSelector, RootState, updateNewJob
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// --- Define Props Interface ---
interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  // Add height/width props if you want to control size from parent
  height?: string;
  width?: string;
}

// --- Use Props Interface ---
export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder,
  height = "10rem", // Default height
  width = "100%", // Default width (changed from fixed 60%)
}) => {
  // Removed Redux state access and dispatch

  // The handleChange function now directly calls the passed onChange prop
  const handleChange = (content: string) => {
    // ReactQuill might return HTML content. Ensure it's handled correctly.
    // If the content is '<p><br></p>', it often means empty editor, treat as empty string.
    onChange(content === '<p><br></p>' ? '' : content);
  };

  return (
    // Use the width prop for styling
    <div className="text-editor rounded-lg overflow-clip" style={{ width: width }}>
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        // Use the height prop for styling
        className="border-1 rounded-lg"
        style={{ height: height }}
        value={value} // Use value prop
        onChange={handleChange} // Use internal handleChange which calls the prop
        placeholder={placeholder || "Write something awesome..."}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

// Removed default export if not needed, keep named export 'Editor'
