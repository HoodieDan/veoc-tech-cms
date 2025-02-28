import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Category, Tag } from "../utils/customTypes";
import { jobCategories, tags } from "../utils/mockData";

interface StateParams {
  newCategory: Category;
  showCreateCategory: boolean;
  currentDivision: string;
  tags: Tag[];
  categories: Category[];
  updating: boolean;
  loading: boolean;
  updateIndex: number | null;
}

const initialState: StateParams = {
  tags,
  currentDivision: "",
  updating: false,
  loading: false,
  updateIndex: null,
  newCategory: {
    name: "",
    tag: { color: "#7E00F1", active: true },
    division: [
      "IT Support",
      "Bubble Developer",
      "Flutter Developer",
      "IT Support Intern",
      "UI Developer",
    ],
  },
  categories: jobCategories,
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
    addCategory: (state) => {
      if (state.updating && state.updateIndex) {
        state.categories[state.updateIndex] = state.newCategory;
        state.newCategory = {
          name: "",
          tag: {
            active: false,
            color: "",
          },
          division: [
            "IT Support",
            "Bubble Developer",
            "Flutter Developer",
            "IT Support Intern",
            "UI Developer",
          ],
        };
        state.showCreateCategory = false;
        state.updating = false;
        state.updateIndex = null;
        return;
      }
      state.categories.push(state.newCategory);
      state.newCategory = {
        name: "",
        tag: {
          active: false,
          color: "",
        },
        division: [
          "IT Support",
          "Bubble Developer",
          "Flutter Developer",
          "IT Support Intern",
          "UI Developer",
        ],
      };
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
    },
  },
});

export const {
  updateCategory,
  changeActiveTag,
  updateCurrentDivision,
  addCategory,
  setShowCreateCategory,
  setUpdating,
  initUpdate,
  removeDivision,
} = categorySlice.actions;
export default categorySlice.reducer;
