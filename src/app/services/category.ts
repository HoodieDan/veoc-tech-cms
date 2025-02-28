import axios from "axios";
import { Category } from "../utils/customTypes";

export const fetchCategories = async () => {
  const response = await axios.get("/api/categories");
  return response.data;
};

export const createCategory = async (category: Category) => {
  const response = await axios.post("/api/categories", category);
  return response.data;
};
