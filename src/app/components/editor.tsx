"use client";
import React from "react";
import EditorToolbar, { modules, formats } from "./editor_custom_toolbar";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore/store";
import { updateNewJob } from "../reduxStore/jobActionSlice";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export const Editor = () => {
  const dispatch = useDispatch();
  const jobAction = useSelector((state: RootState) => state.jobAction);

  const handleChange = (value: string) => {
    dispatch(
      updateNewJob({
        key: "desc",
        value: value,
      })
    );
  };
  return (
    <>
      <div className="text-editor rounded-lg overflow-clip w-[60%]">
        <EditorToolbar />
        <ReactQuill
          theme="snow"
          className="h-[10rem] border-1 rounded-lg"
          value={jobAction.newJob?.desc}
          onChange={handleChange}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
        />
      </div>
    </>
  );
};
