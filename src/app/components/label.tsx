import React from "react";

interface Params {
  content: string;
}

function Label({ content }: Params) {
  return (
    <div className="rounded-full cursor-pointer bg-gray/30 text-foreground/70 font-medium text-xs py-1 px-3">
      {content}
    </div>
  );
}

export default Label;
