"use state";
import React from "react";
import Label from "./label";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../reduxStore/store";
import {
  changeActiveTag,
  removeDivision,
  setShowCreateCategory,
  updateCategory,
  updateCurrentDivision,
} from "../reduxStore/categorySlice";
import { saveCategory } from "../reduxStore/thunks/categoryThunk";

function CreateCategoryCard() {
  const dispatch = useDispatch<AppDispatch>();
  const category = useSelector((state: RootState) => state.category);
  const activeTag = category.tags.find((tag) => tag.active == true);
  console.log(
    "categories: ",
    category.categories,
    category.newCategory,
    category.tags
  );

  return (
    <div className="absolute w-full z-20 h-full right-0 top-0 bg-foreground/30 border-2 flex items-center justify-center">
      <div className="space-y-8 w-[30rem] p-6 rounded-xl bg-background">
        <div className="flex gap-x-5 items-center">
          <div
            className="h-[3.4rem] w-[3.4rem] rounded-full"
            style={{ backgroundColor: activeTag?.color }}
          />
          <h2 className="text-lg font-medium">Create a new Category</h2>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-name">Category Name</label>
          <input
            className="border border-gray/40 p-2 px-3 flex outline-none gap-4 h-[2.5rem] w-full items-center rounded text-sm"
            type="text"
            placeholder="Enter category name"
            id="category-name"
            value={category.newCategory.name}
            onChange={(e) =>
              dispatch(updateCategory({ key: "name", value: e.target.value }))
            }
            name="category-name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="color-tag">Category tag</label>
          <div className="flex gap-x-4 items-center">
            {category.tags.map((tag, index) => (
              <div
                key={index}
                className={`h-[1.5rem] w-[1.5rem] rounded-full border-2 border-transparent  bg-transparent flex items-center justify-center`}
                style={{ borderColor: tag.active ? tag.color : "transparent" }}
              >
                <div
                  key={index}
                  onClick={() => {
                    dispatch(updateCategory({ key: "tag", value: tag }));
                    dispatch(changeActiveTag(index));
                  }}
                  className={`h-[1rem] w-[1rem] cursor-pointer rounded-full`}
                  style={{ backgroundColor: tag.color }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="category-name">
            Divisions: {category.newCategory.division.length}
          </label>
          <div className="border border-gray/40 py-1 px-3 pr-1 flex gap-4 h-[2.5rem] w-full items-center rounded text-sm">
            <input
              className="h-full outline-none w-full"
              type="text"
              placeholder="Add new division"
              id="category-name"
              name="category-name"
              value={category.currentDivision}
              onChange={(e) => dispatch(updateCurrentDivision(e.target.value))}
            />
            <button
              onClick={() =>
                dispatch(
                  updateCategory({
                    key: "division",
                    value: [
                      ...category.newCategory.division,
                      category.currentDivision,
                    ],
                  })
                )
              }
              className="px-5 h-full rounded flex bg-accent items-center text-background"
            >
              <p className="">Add</p>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {category.newCategory.division.map((divison, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => dispatch(removeDivision(index))}
                className="bg-foreground/60 hover:bg-foreground rounded-full p-[1px] absolute right-1 -top-2"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.91797 2.91663L7.08464 7.08329M2.91797 7.08329L7.08464 2.91663"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <Label key={index} content={divison} />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => dispatch(setShowCreateCategory(false))}
            className="px-6 py-2 rounded-lg flex border border-accent justify-center items-center text-accent"
          >
            <p className="">Cancel</p>
          </button>
          <button
            disabled={
              !category.newCategory.name.trim() || !category.newCategory.tag.color
            }
            onClick={() => dispatch(saveCategory({category: category.newCategory, updating: category.updating, updateIndex: category.updateIndex}))}  
            // className="px-3 py-2 rounded-lg flex border bg-accent justify-center items-center text-background"
            className={`px-3 py-2 rounded-lg flex border justify-center items-center text-background ${
              !category.newCategory.name.trim() || !category.newCategory.tag.color
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-accent"
            }`}
          >
            <p className="">
              {category.updating ? "Update Category" : "Create new category"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCategoryCard;
