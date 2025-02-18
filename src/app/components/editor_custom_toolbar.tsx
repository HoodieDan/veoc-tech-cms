import React from "react";

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {},
  },
};

// Formats objects for setting up the Quill editor
export const formats = [
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
];

// Quill Toolbar component
export const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
  </div>
);

export default QuillToolbar;
