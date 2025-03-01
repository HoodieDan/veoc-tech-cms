import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Category, Tag } from "../utils/customTypes";
import { tags } from "../utils/mockData";
import { fetchCategories, saveCategory } from "./thunks/categoryThunk";

interface StateParams {
  newCategory: Category;
  showCreateCategory: boolean;
  currentDivision: string;
  tags: Tag[];
  categories: Category[];
  updating: boolean;
  loading: boolean;
  submitting: boolean;

  updateIndex: number | null;
  error: string | null;
}

const newCategory = {
  _id: "",
  name: "",
  tag: { active: false, color: "#7E00F1" },
  division: [
    "IT Support",
    "Bubble Developer",
    "Flutter Developer",
    "IT Support Intern",
    "UI Developer",
  ],
};

const initialState: StateParams = {
  tags,
  currentDivision: "",
  updating: false,
  loading: false,
  submitting: false,
  updateIndex: null,
  error: null,
  newCategory,
  categories: [],
  showCreateCategory: false,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateCategory: <T>(
      state: StateParams,
      action: PayloadAction<{ key: string; value: T }>
    ) => {
      state.newCategory = {
        ...state.newCategory,
        [action.payload.key]: action.payload.value,
      };
      state.currentDivision = "";
    },
    changeActiveTag: (state: StateParams, action: PayloadAction<number>) => {
      state.tags.forEach((tag, index) => {
        tag.active = index === action.payload;
      });
    },
    updateCurrentDivision: (state, action: PayloadAction<string>) => {
      state.currentDivision = action.payload;
    },

    setShowCreateCategory: (state, action: PayloadAction<boolean>) => {
      state.showCreateCategory = action.payload;
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.updating = action.payload;
    },
    removeDivision: (state, action: PayloadAction<number>) => {
      const filteredDivisions = state.newCategory.division.filter(
        (_, index) => index !== action.payload
      );
      state.newCategory.division = filteredDivisions;
    },
    initUpdate: (state, action: PayloadAction<number>) => {
      state.updating = true;
      state.updateIndex = action.payload;
      state.newCategory = state.categories[action.payload];
      state.showCreateCategory = true;
    },
    initNew: (state) => {
      state.updating = false;
      state.newCategory = newCategory;
      state.showCreateCategory = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        console.log("Fetching categories...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        console.log("Fetch successful, categories updated");
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error("Fetch failed:", action.payload);
        state.loading = false;
        state.error = action.payload as string;

        alert(state.error);

      })

      .addCase(saveCategory.pending, (state) => {
        console.log("Saving category...");
        state.submitting = true;
        state.error = null;
      })
      .addCase(saveCategory.fulfilled, (state, action) => {
        console.log("Save successful:", action.payload);

        if (state.updating && state.updateIndex !== null) {
          state.categories[state.updateIndex] = action.payload;
        } else {
          state.categories.push(action.payload);
        }

        state.newCategory = newCategory;
        state.showCreateCategory = false;
        state.updating = false;
        state.updateIndex = null;
        state.submitting = false;
      })
      .addCase(saveCategory.rejected, (state, action) => {
        console.error("Save failed:", action.payload);
        state.submitting = false;
        state.error = action.payload as string;

        alert(state.error);
      });
  },
});

export const {
  updateCategory,
  changeActiveTag,
  updateCurrentDivision,
  setShowCreateCategory,
  setUpdating,
  initUpdate,
  initNew,
  removeDivision,
} = categorySlice.actions;

export default categorySlice.reducer;
