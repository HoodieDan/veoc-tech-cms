// "use client";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { updateDropdownContent } from "../reduxStore/dropdownSlice";

// interface Params {
//   items: Array<{ type: string; action: (index: number) => void }>;
//   index: number;
// }

// function Dropdown({ items, index }: Params) {
//   const dispatch = useDispatch();
//   const handleClick = (
//     event: React.MouseEvent,
//     item: { type: string; action: (index: number) => void }
//   ) => {
//     event.stopPropagation();
//     item.action(index);
//     dispatch(updateDropdownContent({ id: index, content: item.type }));
//   };

//   return (
//     <ul className="py-1 rounded-lg absolute z-20 w-[10rem] space-y-1 right-0 bg-background shadow-xl">
//       {items.map((item, index) => (
//         <li
//           onClick={(e) => handleClick(e, item)}
//           key={index}
//           className="py-2 px-4 cursor-pointer hover:bg-gray/30 text-xs"
//         >
//           {item.type}
//         </li>
//       ))}
//     </ul>
//   );
// }

// export default Dropdown;
// /Users/a0000/Documents/CODE/WORK/veoc-tech-cms/src/app/components/dropdown.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { resetDropdown } from "../reduxStore/dropdownSlice";

// Define the expected shape of dropdown items
interface DropdownItem {
  type: string; // The text displayed
  action: () => void; // The function to call on click
}

interface DropdownProps {
  items: DropdownItem[];
  // index prop is not used in this version, can be removed if not needed elsewhere
  index?: number;
}

function Dropdown({ items }: DropdownProps) {
  const dispatch = useDispatch();

  const handleClick = (
    e: React.MouseEvent<HTMLLIElement>,
    item: DropdownItem
  ) => {
    e.stopPropagation(); // Prevent parent clicks
    item.action(); // Execute the item's action
    dispatch(resetDropdown()); // Close all dropdowns after action
  };

  return (
    // --- Styling Adjustments ---
    <ul
      className="
        absolute
        right-8       
        mt-2              
        min-w-max         
        bg-white          
        rounded-md        
        shadow-lg         
        ring-1           
        ring-black
        ring-opacity-5
        z-20             
        max-h-25          
        overflow-y-auto   
        text-xs          
      "
    >
      {items.map((item, idx) => (
        <li
          onClick={(e) => handleClick(e, item)}
          key={idx}
          className="
            py-2
            px-4
            cursor-pointer
            hover:bg-gray-100 // Hover effect
            whitespace-nowrap   // Prevent text wrapping within an item
          "
        >
          {item.type}
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;
