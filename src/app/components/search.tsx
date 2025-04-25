import React from "react";

interface SearchParams {
  placeholder: string;
  height: string;
  width: string;
  value: string; // Add value prop
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
  className?: string; // Allow passing additional classes
}

// Use React.FC for functional components with props
const Search: React.FC<SearchParams> = ({
  placeholder,
  height,
  width,
  value,
  onChange,
  className = "" // Default to empty string
}) => {
  return (
    <div
      className={`border border-gray/40 p-2 flex gap-4 items-center rounded-lg ${className}`} // Apply base styles and additional classes
      style={{ height, width }} // Use style prop for dynamic dimensions
    >
      {/* Placeholder for Search Icon */}
      <svg
        className="h-5 w-5 ml-1 text-gray-500 flex-shrink-0" // Added text color and shrink
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_search_icon)">
          <path
            d="M15.8026 14.8625L11.8232 10.8831C12.9077 9.55686 13.4408 7.86453 13.3125 6.15617C13.1841 4.44782 12.404 2.85415 11.1336 1.70481C9.86321 0.555472 8.19963 -0.0616068 6.487 -0.0187856C4.77436 0.0240356 3.1437 0.723481 1.93231 1.93487C0.720917 3.14627 0.0214721 4.77693 -0.0213491 6.48956C-0.0641703 8.20219 0.552909 9.86577 1.70225 11.1362C2.85159 12.4066 4.44526 13.1867 6.15361 13.315C7.86196 13.4434 9.5543 12.9102 10.8806 11.8258L14.8599 15.8051C14.9856 15.9266 15.154 15.9938 15.3288 15.9922C15.5036 15.9907 15.6708 15.9206 15.7944 15.797C15.9181 15.6734 15.9882 15.5062 15.9897 15.3314C15.9912 15.1566 15.924 14.9882 15.8026 14.8625ZM6.66457 12.0005C5.60973 12.0005 4.57859 11.6877 3.70153 11.1016C2.82446 10.5156 2.14088 9.68265 1.73721 8.70811C1.33354 7.73357 1.22793 6.66122 1.43371 5.62665C1.6395 4.59208 2.14745 3.64178 2.89333 2.8959C3.63921 2.15002 4.58952 1.64206 5.62409 1.43628C6.65865 1.23049 7.73101 1.33611 8.70555 1.73977C9.68009 2.14344 10.513 2.82703 11.0991 3.70409C11.6851 4.58115 11.9979 5.6123 11.9979 6.66713C11.9963 8.08113 11.4339 9.43676 10.4341 10.4366C9.4342 11.4365 8.07857 11.9989 6.66457 12.0005Z"
            fill="currentColor" // Use currentColor
          />
        </g>
        <defs>
          <clipPath id="clip0_search_icon"> {/* Unique clipPath ID */}
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-full outline-none bg-transparent text-sm" // Added text-sm
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Search; // Use default export
