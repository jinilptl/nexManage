import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMainDashboard } from "../../services/analyticsOperations/analyticsServices";

export const getDashboardData = createAsyncThunk(
  "dashboard/dashboard",
  async () => {
    const res = await fetchMainDashboard();
    return res.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    data: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getDashboardData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
