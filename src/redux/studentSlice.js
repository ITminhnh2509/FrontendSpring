import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/student";

// Fetch all students with pagination
export const getAlll = createAsyncThunk(
  "student/getAll",
  async ({ currentPage, limit }, thunkAPI) => {
    const url = `${BASE_URL}/list?page=${currentPage}&size=${limit}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteStudentById = createAsyncThunk(
  "student/deleteById",
  async (id, thunkAPI) => {
    const url = `${BASE_URL}/delete/${id}`;
    try {
      const response = await axios.delete(url);
      return { id, message: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const saveStudent = createAsyncThunk(
  "student/save",
  async (studentData, thunkAPI) => {
    const url = `${BASE_URL}/save`;
    try {
      const response = await axios.post(url, studentData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateStudent = createAsyncThunk(
  "student/update",
  async ({ id, studentData }, thunkAPI) => {
    const url = `${BASE_URL}/update/${id}`;
    try {
      const response = await axios.put(url, studentData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getStudentByName = createAsyncThunk(
  "student/getByName",
  async (name, thunkAPI) => {
    const url = `${BASE_URL}/get?ten=${name}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: [],
    totalPages: 0,
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlll.fulfilled, (state, action) => {
        state.students = action.payload.data.studentList;
        state.totalPages = action.payload.data.totalPages;
        state.status = "success";
      })
      .addCase(deleteStudentById.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload.id
        );
        state.status = "deleted";
      })
      .addCase(saveStudent.fulfilled, (state, action) => {
        state.students.push(action.payload.data);
        state.status = "added";
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(
          (student) => student.id === action.payload.id
        );
        state.students[index] = action.payload;
        state.status = "updated";
      })
      .addCase(getStudentByName.fulfilled, (state, action) => {
        state.students = action.payload;
        state.status = "success";
      })
      .addCase(getAlll.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "error";
      });
  },
});

export default studentSlice.reducer;
