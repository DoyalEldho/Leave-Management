
import { configureStore } from '@reduxjs/toolkit';
import { leaveReducer } from '../feature/leaveSlice';
import  { approvedLeaveReducer } from '../feature/leaveSlice';
import { adminReducer, leaveSummaryReducer } from '../feature/adminSlice';

const store = configureStore({
  reducer: {
    leave: leaveReducer,
    approvedLeaves:approvedLeaveReducer,
    admin:adminReducer,
    leaveSummary:leaveSummaryReducer
  }
});

export default store;
