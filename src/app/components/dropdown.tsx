"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { updateDropdownContent } from "../reduxStore/dropdownSlice";

interface Params {
  items: Array<{ type: string; action: () => void }>;
  index: number;
}

function Dropdown({ items, index }: Params) {
  const dispatch = useDispatch();
  const handleClick = (
    event: React.MouseEvent,
    item: { type: string; action: () => void }
  ) => {
    event.stopPropagation();
    item.action();
    dispatch(updateDropdownContent({ id: index, content: item.type }));
  };

  return (
    <ul className="py-1 rounded-lg absolute z-20 w-[10rem] space-y-1 right-0 bg-background shadow-xl">
      {items.map((item, index) => (
        <li
          onClick={(e) => handleClick(e, item)}
          key={index}
          className="py-2 px-4 cursor-pointer hover:bg-gray/30 text-xs"
        >
          {item.type}
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;
