import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DropdownState<T = unknown> {
  active: boolean;
  content?: T;
}

interface StateParams<T = unknown> {
  dropdowns: Record<number, DropdownState<T>>;
  dropdownUpdateCount: number;
}

const initialState: StateParams = {
  dropdowns: {},
  dropdownUpdateCount: 0,
};

export const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    toggleDropdown: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.dropdowns[id]) {
        state.dropdowns[id] = { active: true };
        return;
      }

      //reset dropdown
      Object.keys(state.dropdowns).forEach((key) => {
        const id = Number(key);
        state.dropdowns[id].active = false;
      });

      //set active
      state.dropdowns[id].active = !state.dropdowns[id].active;
      state.dropdownUpdateCount = 0;
    },

    updateDropdownContent: <T>(
      state: StateParams<T>,
      action: PayloadAction<{ id: number; content: T }>
    ) => {
      const { id, content } = action.payload;
      state.dropdowns[id].content = content;
      state.dropdowns[id].active = false;
    },

    resetDropdown: (state) => {
      const hasActiveDropdown = Object.values(state.dropdowns).some(
        (dropdown) => dropdown.active
      );
      if (!hasActiveDropdown) return;

      state.dropdownUpdateCount += 1;
      if (state.dropdownUpdateCount % 2 != 0) return;

      Object.keys(state.dropdowns).forEach((key) => {
        const id = Number(key);
        if (state.dropdowns[id].active) {
          state.dropdowns[id].active = false;
        }
      });
    },
  },
});

export const {
  toggleDropdown,
  updateDropdownContent,
  resetDropdown,
} = dropdownSlice.actions;
export default dropdownSlice.reducer;
