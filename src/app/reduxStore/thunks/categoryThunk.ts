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