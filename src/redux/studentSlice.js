import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import StudentPage from "../pages/student/StudentPage";

const BASE_URL = "http://localhost:8080/api/v1";

export const getAlll = createAsyncThunk(
  "student/getAll",
  async ({ currentPage, limit }, thunkAPI) => {
    const url = `http://localhost:8080/api/v1/student/list?page=${currentPage}&size=${limit}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
  }
);
const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: null,
    totalPages: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAlll.fulfilled, (state, action) => {
      state.students = action.payload.data.studentList;
      state.totalPages = action.payload.data.totalPages;
    });
  },
});
export default studentSlice.reducer;
