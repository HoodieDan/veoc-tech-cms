import React from "react";
import { useDispatch } from "react-redux";
import { updateAction } from "../reduxStore/jobActionSlice";
import { JobAction } from "../utils/customTypes";

function ActionCard() {
  const dispatch = useDispatch();
  const handleActionUpdate = (action: JobAction) => {
    dispatch(updateAction(action));
  };
  return (
    <ul className="py-1 rounded-lg absolute z-20 w-[10rem] space-y-1 right-0 bg-background shadow-xl">
      <li
        onClick={() => handleActionUpdate(JobAction.ADD_TO_DRAFTS)}
        className="py-2 px-4 hover:bg-gray/30 text-xs"
      >
        Add to drafts
      </li>
      <li
        onClick={() => handleActionUpdate(JobAction.OPEN_JOB)}
        className="py-2 px-4 hover:bg-gray/30 text-xs"
      >
        Open job
      </li>
      <li
        onClick={() => handleActionUpdate(JobAction.DELETE_JOB)}
        className="py-2 px-4 hover:bg-gray/30 text-xs"
      >
        Delete job
      </li>
    </ul>
  );
}

export default ActionCard;
