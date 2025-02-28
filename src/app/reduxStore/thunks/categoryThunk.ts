import { Category } from "@/app/utils/customTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/category"); // Replace with actual API
      console.log("Fetched Categories:", response.data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Fetch Categories Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const saveCategory = createAsyncThunk(
  "category/saveCategory",
  async (
    { category, updating, updateIndex }: { category: Category; updating: boolean; updateIndex: number | null },
    { rejectWithValue }
  ) => {
    console.log(category);
    
    try {
      let response;
      if (updating && updateIndex !== null) {
       
        response = await axios.patch(`/api/category/${category._id}`, category);
      } else {
        
        response = await axios.post("/api/category", category);
      }

      console.log("Category successfully saved:", response.data);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error saving category:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to save category"
      );
    }
  }
);
