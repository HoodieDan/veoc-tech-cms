import React from "react";

interface Params {
  subtext: string;
  text: string;
}

function HighlightCard({ subtext, text }: Params) {
  return (
    <div className="border border-gray/30 p-4 space-y-3 w-[20rem] bg-background rounded-lg">
      <p className="text-sm text-foreground/60">{subtext}</p>
      <h3 className="text-2xl font-semibold">{text}</h3>
    </div>
  );
}

export default HighlightCard;
