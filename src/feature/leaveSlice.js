import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//api
export const fetchLeaves = createAsyncThunk('leaves/fetchLeaves', async () => {
  const res = await axios.get('http://localhost:5000/api/leave/History',{withCredentials: true});
  return res.data;
});

export const submitLeave = createAsyncThunk('leaves/submitLeave', async (data, { dispatch }) => {
  await axios.post('http://localhost:5000/api/leaves', data ,{withCredentials: true});
  dispatch(fetchLeaves()); 
});

export const cancelLeave = createAsyncThunk('leaves/cancelLeave', async (id, { dispatch }) => {
  await axios.delete(`http://localhost:5000/api/cancel/leave/${id}`,{withCredentials: true});
  dispatch(fetchLeaves()); 
});


const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    history: [],
    status: 'ntg',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => { //fetchLeaves came from createAsyncThunk('/leaves/fetchLeaves)
        state.status = 'loading';
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload; //into array
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const approvedLeaves = createAsyncThunk('/leaves/approved',async()=>{
  const res = await axios.get('http://localhost:5000/api/leave/approved',{withCredentials: true});
  return res.data;
})


const approvedSlice = createSlice({
  name: 'approvedLeaves',
  initialState: {
    summary: [],
    status: 'ntg',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approvedLeaves.pending, (state) => { 
        state.status = 'loading';
      })
      .addCase(approvedLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload; //into array
      })
      .addCase(approvedLeaves.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})

export const leaveReducer = leaveSlice.reducer;
export const approvedLeaveReducer = approvedSlice.reducer;
