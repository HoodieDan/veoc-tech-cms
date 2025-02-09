import React from "react";
import { Status } from "../utils/customTypes";

interface Params {
  type: Status;
}

function StatusCard({ type }: Params) {
  return (
    <div
      className={`py-1 px-3 rounded text-xs ${
        type == Status.OPEN
          ? "text-green-500 bg-green-200"
          : type == Status.CLOSED
          ? "text-red-500 bg-red-300"
          : type == Status.DRAFT
          ? "text-gray bg-gray/20"
          : ""
      }`}
    >
      {type}
    </div>
  );
}

export default StatusCard;
