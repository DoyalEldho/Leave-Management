import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//api
export const pendingRequestLeaves = createAsyncThunk('leaves/pendingRequestLeaves', async () => {
  const res = await axios.get('http://localhost:5000/admin/api/leave',{withCredentials: true});
  return res.data;
});

export const updateLeaveStatus = createAsyncThunk('leaves/updateLeaveStatus',async ({ id, status, employeeId }) => {
    const res = await axios.patch(`http://localhost:5000/admin/api/${status}/leave/${id}`,
      { employeeId },
      { withCredentials: true }
    );
  }
);

export const leaveSummary = createAsyncThunk('leaves/summary', async () => {
  const res = await axios.get('http://localhost:5000/admin/api/leave/summary',{withCredentials: true});
  return res.data;
});


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    history: [],
    status: 'ntg',
    error: null,
     requestCount:0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pendingRequestLeaves.pending, (state) => { 
        state.status = 'loading';
      })
      .addCase(pendingRequestLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload; //into array
        state.requestCount=action.payload.length;
      })
      .addCase(pendingRequestLeaves.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
        .addCase(updateLeaveStatus.pending, (state) => {
        state.status = 'patching';
      })
      .addCase(updateLeaveStatus.fulfilled, (state) => {
        state.status = 'patched';
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.status = 'patch-failed';
        state.error = action.error.message;
      });
  }

});


const leaveSummarySlice = createSlice({
  name: 'summary',
  initialState: {
    history: [],
    status: 'ntg',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(leaveSummary.pending, (state) => { 
        state.status = 'loading';
      })
      .addCase(leaveSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload; //into array
      })
      .addCase(leaveSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
  }

});

export const adminReducer = adminSlice.reducer;
export const leaveSummaryReducer = leaveSummarySlice.reducer;


