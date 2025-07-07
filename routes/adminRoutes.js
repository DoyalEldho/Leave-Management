const express = require('express');
const adminRouter =express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getAllLeave, filterEmployee, getLeaveSummary, approveLeave, rejectLeave } = require('../controller/adminController');


// Routes
 adminRouter.get('/api/leave',auth,role('admin'),getAllLeave);
 adminRouter.get('/api/filter',auth,role('admin'),filterEmployee)
adminRouter.get('/api/leave/summary',auth,role('admin'),getLeaveSummary);
adminRouter.patch('/api/approve/leave/:id',auth,role('admin'),approveLeave);
adminRouter.patch('/api/reject/leave/:id',auth,role('admin'),rejectLeave);

module.exports = adminRouter;