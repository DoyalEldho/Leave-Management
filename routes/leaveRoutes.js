const express = require('express');
const { applyLeave, cancelLeaveRequest, ownLeaveHistory, ApprovedLeaves } = require('../controller/leaveController');
const leaveRouter =express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Routes
 leaveRouter.post ('/leaves',auth,role('user'),applyLeave);
  leaveRouter.delete('/cancel/leave/:id',auth,role('user'),cancelLeaveRequest);
  leaveRouter.get('/leave/History',auth,role('user'),ownLeaveHistory);
  leaveRouter.get('/leave/approved',auth,role('user'),ApprovedLeaves);
  

module.exports = leaveRouter;