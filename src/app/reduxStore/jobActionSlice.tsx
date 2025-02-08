import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { JobAction } from "../utils/customTypes";

interface StateParams {
  action: JobAction | null;
}
const initialState: StateParams = {
  action: null,
};

export const jobActionSlice = createSlice({
  name: "job-action",
  initialState,
  reducers: {
    updateAction: (state, action: PayloadAction<JobAction | null>) => {
      state.action = action.payload;
    },
  },
});

export const { updateAction } = jobActionSlice.actions;

export default jobActionSlice.reducer;
