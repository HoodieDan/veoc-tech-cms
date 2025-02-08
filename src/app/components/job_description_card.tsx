import React from "react";
import StatusCard from "./status_card";
import { Status } from "../utils/customTypes";
import HighlightCard from "./highlight_card";
import Image from "next/image";
import JobImage from "../assets/jobimg.png";
import { useDispatch } from "react-redux";
import { updateAction } from "../reduxStore/jobActionSlice";

function JobDescriptionCard() {
  const dispatch = useDispatch();
  const closeJobDescription = () => {
    dispatch(updateAction(null));
  };
  return (
    <div className="fixed top-0 right-0 h-[100vh] w-[100vw] z-40 bg-foreground/20">
      <div className="fixed top-0 right-0 overflow-y-auto pb-6 h-[100vh] space-y-8 w-[30vw] bg-background px-4">
        <div className="flex justify-between items-center border-b border-b-gray/30 py-4">
          <div className="flex gap-x-3">
            <h2>Job Description</h2>
            <StatusCard type={Status.OPEN} />
          </div>
          <svg
            className="cursor-pointer"
            onClick={closeJobDescription}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.0018 4.99997C14.8455 4.84374 14.6336 4.75598 14.4126 4.75598C14.1917 4.75598 13.9797 4.84374 13.8235 4.99997L10.0018 8.82164L6.18013 4.99997C6.02386 4.84374 5.81194 4.75598 5.59097 4.75598C5.37 4.75598 5.15807 4.84374 5.0018 4.99997C4.84558 5.15624 4.75781 5.36817 4.75781 5.58914C4.75781 5.81011 4.84558 6.02203 5.0018 6.1783L8.82347 9.99997L5.0018 13.8216C4.84558 13.9779 4.75781 14.1898 4.75781 14.4108C4.75781 14.6318 4.84558 14.8437 5.0018 15C5.15807 15.1562 5.37 15.244 5.59097 15.244C5.81194 15.244 6.02386 15.1562 6.18013 15L10.0018 11.1783L13.8235 15C13.9797 15.1562 14.1917 15.244 14.4126 15.244C14.6336 15.244 14.8455 15.1562 15.0018 15C15.158 14.8437 15.2458 14.6318 15.2458 14.4108C15.2458 14.1898 15.158 13.9779 15.0018 13.8216L11.1801 9.99997L15.0018 6.1783C15.158 6.02203 15.2458 5.81011 15.2458 5.58914C15.2458 5.36817 15.158 5.15624 15.0018 4.99997Z"
              fill="#000706"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">
            General Manager @ AXCEL CYBER
          </h2>
          <p className="text-sm text-foreground/50">
            January 15th 2025, 3:30pm
          </p>
        </div>

        <div>
          <title>Application Tracking</title>
          <div className="flex justify-between space-x-6">
            <HighlightCard subtext={"Application"} text={"500"} />
            <HighlightCard subtext={"Application"} text={"500"} />
            <HighlightCard subtext={"Application"} text={"500"} />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-foreground/50">
            Thank you for been our loyal customer, as a token... Thank you for
            been our loyal customer, as a token... Thank you for been our loyal
            customer, as a token...Thank you for been our loyal customer, as a
            token...Thank you for been our loyal customer, as a token...Thank
            you for been our loyal customer, as a token...Thank you for been our
            loyal customer, as a token...Thank you for been our loyal customer,
            as a token...Thank you for been our loyal customer, as a
            token...Thank you for been our loyal customer, as a token...Thank
            you for been our loyal customer, as a token...
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Media</h3>
          <div className="h-[13rem] rounded-lg relative overflow-clip bg-gray">
            <Image
              src={JobImage.src}
              height={JobImage.height}
              width={JobImage.width}
              className="w-full h-full object-cover absolute"
              alt="Job image"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between">
          <div className="w-[10rem] py-2">
            <h3 className="font-semibold">Start date</h3>
            <p className="text-foreground/50">12/10/2023</p>
          </div>
          <div className="w-[10rem] py-2">
            <h3 className="font-semibold">Location</h3>
            <p className="text-foreground/50">Lagos</p>
          </div>
          <div className="w-[10rem] py-2">
            <h3 className="font-semibold">Department</h3>
            <p className="text-foreground/50">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDescriptionCard;
