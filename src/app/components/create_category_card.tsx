import React from "react";
import Label from "./label";

interface Params {
  createCategory: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateCategoryCard({ createCategory }: Params) {
  return (
    <div className="absolute w-full z-20 h-full right-0 top-0 bg-foreground/30 border-2 flex items-center justify-center">
      <div className="space-y-8 w-[30rem] p-6 rounded-xl bg-background">
        <div className="flex gap-x-5 items-center">
          <div className="h-[3.4rem] w-[3.4rem] bg-purple-800 rounded-full" />
          <h2 className="text-lg font-medium">Create a new Category</h2>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-name">Category Name</label>
          <input
            className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
            type="text"
            placeholder="Enter category name"
            id="category-name"
            name="category-name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="color-tag">Category tag</label>
          <div className="flex gap-x-4 items-center">
            <div className="h-[1rem] w-[1rem] bg-[#0F1928] rounded-full" />
            <div className="h-[1rem] w-[1rem] bg-[#7E00F1] rounded-full" />
            <div className="h-[1rem] w-[1rem] bg-[#4600D0] rounded-full" />
            <div className="h-[1rem] w-[1rem] bg-[#3144F5] rounded-full" />
            <div className="h-[1rem] w-[1rem] bg-[#008BB3] rounded-full" />
            <div className="h-[1rem] w-[1rem] bg-[#009A54] rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-name">Divisions: 5</label>
          <div className="border border-gray/40 py-1 px-3 pr-1 flex gap-4 h-[2.5rem] w-full items-center rounded text-sm">
            <input
              className="h-full outline-none w-full"
              type="text"
              placeholder="Add new division"
              id="category-name"
              name="category-name"
            />
            <button className="px-5 h-full rounded flex bg-accent items-center text-background">
              <p className="">Add</p>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Label content="IT Support" />
          <Label content="Bubble Developer" />
          <Label content="Flutter Developer" />
          <Label content="IT Support Inter" />
          <Label content="UI Developer" />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => createCategory(false)}
            className="px-3 py-2 rounded-lg flex border border-accent justify-center items-center text-accent"
          >
            <p className="">Cancel</p>
          </button>
          <button className="px-3 py-2 rounded-lg flex border bg-accent justify-center items-center text-background">
            <p className="">Create new category</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCategoryCard;
