import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface DropdownItemState {
  id: number;
  active: boolean;
  content: string | null;
}

interface DropdownState {
  // Use a Record (object map) for dynamic access by ID (index)
  dropdowns: Record<number, DropdownItemState>;
}

// Initial state with an empty object
const initialState: DropdownState = {
  dropdowns: {},
};

// Helper to get or create default state for a specific dropdown ID
const getOrCreateDropdown = (state: DropdownState, id: number): DropdownItemState => {
  if (!state.dropdowns[id]) {
    // If it doesn't exist, create it with default values
    state.dropdowns[id] = { id: id, active: false, content: null };
  }
  return state.dropdowns[id];
};

export const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    toggleDropdown: (state, action: PayloadAction<number>) => {
      const targetId = action.payload;
      const targetDropdown = getOrCreateDropdown(state, targetId); // Get or create
      const wasActive = targetDropdown.active;

      // Deactivate all others
      Object.values(state.dropdowns).forEach(dropdown => {
        if (dropdown.id !== targetId) {
          dropdown.active = false;
        }
      });

      // Toggle the target
      targetDropdown.active = !wasActive;
    },

    updateDropdownContent: (state, action: PayloadAction<{ id: number; content: string | null }>) => {
      const targetId = action.payload.id;
      const dropdown = getOrCreateDropdown(state, targetId); // Get or create
      dropdown.content = action.payload.content;
      // dropdown.active = false; // Optional: close dropdown on selection
    },

    resetDropdown: (state) => {
      Object.values(state.dropdowns).forEach(dropdown => {
        dropdown.active = false;
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
