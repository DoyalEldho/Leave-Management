
const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person', 
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['sick', 'casual', 'other'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
    days: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});


//model middleware to calculate leave days from start to end date
leaveRequestSchema.pre('validate', function(next) {
  if (this.fromDate && this.toDate) {
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    const diffInTime = to.getTime() - from.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)) + 1;

    this.days = diffInDays > 0 ? diffInDays : 1; // At least 1 day
  } else {
    this.days = 1; 
  }
  next();
});


module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
