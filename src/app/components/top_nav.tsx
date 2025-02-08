import React from "react";

function TopNav() {
  return (
    <div className="w-[80%] fixed top-0 z-10 right-0 h-[5rem] bg-white flex justify-between items-center px-10">
      <h1 className="text-xl">Welcome Admin</h1>

      <div className="border border-gray/40 p-2 flex gap-4 h-[3rem] w-[20rem] items-center rounded-lg">
        <svg
          className="h-6 !w-6 ml-2"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_801_8105)">
            <path
              d="M15.8026 14.8625L11.8232 10.8831C12.9077 9.55686 13.4408 7.86453 13.3125 6.15617C13.1841 4.44782 12.404 2.85415 11.1336 1.70481C9.86321 0.555472 8.19963 -0.0616068 6.487 -0.0187856C4.77436 0.0240356 3.1437 0.723481 1.93231 1.93487C0.720917 3.14627 0.0214721 4.77693 -0.0213491 6.48956C-0.0641703 8.20219 0.552909 9.86577 1.70225 11.1362C2.85159 12.4066 4.44526 13.1867 6.15361 13.315C7.86196 13.4434 9.5543 12.9102 10.8806 11.8258L14.8599 15.8051C14.9856 15.9266 15.154 15.9938 15.3288 15.9922C15.5036 15.9907 15.6708 15.9206 15.7944 15.797C15.9181 15.6734 15.9882 15.5062 15.9897 15.3314C15.9912 15.1566 15.924 14.9882 15.8026 14.8625ZM6.66457 12.0005C5.60973 12.0005 4.57859 11.6877 3.70153 11.1016C2.82446 10.5156 2.14088 9.68265 1.73721 8.70811C1.33354 7.73357 1.22793 6.66122 1.43371 5.62665C1.6395 4.59208 2.14745 3.64178 2.89333 2.8959C3.63921 2.15002 4.58952 1.64206 5.62409 1.43628C6.65865 1.23049 7.73101 1.33611 8.70555 1.73977C9.68009 2.14344 10.513 2.82703 11.0991 3.70409C11.6851 4.58115 11.9979 5.6123 11.9979 6.66713C11.9963 8.08113 11.4339 9.43676 10.4341 10.4366C9.4342 11.4365 8.07857 11.9989 6.66457 12.0005Z"
              fill="#374957"
            />
          </g>
          <defs>
            <clipPath id="clip0_801_8105">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <input
          type="text"
          placeholder="Search anything"
          className="w-full h-full outline-none"
        />
      </div>

      <div className="flex gap-2 p-2 items-center">
        <div className="flex items-center justify-center rounded-lg border border-gray/40 bg-gray/20 h-[3rem] w-[3rem]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_946_1156)">
              <path
                d="M5.56641 15.75C5.85715 16.4185 6.33683 16.9876 6.94652 17.3873C7.55621 17.787 8.26937 18 8.99841 18C9.72744 18 10.4406 17.787 11.0503 17.3873C11.66 16.9876 12.1397 16.4185 12.4304 15.75H5.56641Z"
                fill="#374957"
              />
              <path
                d="M16.7929 9.41176L15.4909 5.11951C15.0739 3.61827 14.1674 2.29934 12.9153 1.37213C11.6631 0.44493 10.1371 -0.0374034 8.57956 0.00171693C7.02199 0.0408372 5.52212 0.599169 4.31811 1.58806C3.11409 2.57696 2.27494 3.93973 1.93388 5.46001L0.922879 9.61276C0.788505 10.1646 0.781224 10.7397 0.901587 11.2947C1.02195 11.8498 1.26681 12.3702 1.6177 12.8168C1.96858 13.2634 2.41632 13.6245 2.92712 13.8727C3.43792 14.121 3.99844 14.25 4.56638 14.25H13.2041C13.7897 14.25 14.3671 14.1129 14.8901 13.8497C15.4132 13.5864 15.8673 13.2044 16.2161 12.7341C16.565 12.2638 16.7989 11.7183 16.899 11.1414C16.9991 10.5645 16.9628 9.97211 16.7929 9.41176Z"
                fill="#374957"
              />
            </g>
            <defs>
              <clipPath id="clip0_946_1156">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="border flex items-center rounded-lg gap-2 h-[3rem] px-2 border-gray/40 bg-gray/20">
          <div className="rounded-full p-2 bg-accent text-white">
            <p className="text-xs">UN</p>
          </div>
          <p>Admin</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_946_1168)">
              <path
                d="M12.0008 15L7.75781 10.757L9.17281 9.34302L12.0008 12.172L14.8288 9.34302L16.2438 10.757L12.0008 15Z"
                fill="#2D2929"
              />
            </g>
            <defs>
              <clipPath id="clip0_946_1168">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
