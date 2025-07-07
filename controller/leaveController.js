const LeaveRequest = require('../model/LeaveRequest');
const User = require('../model/User');
const express = require('express');
const sendEmail = require('../utils/sendEmail')

const applyLeave = async(req,res)=>{

    const {fromDate , toDate , type ,reason } = req.body;

    try {
    const user = new LeaveRequest({ fromDate , toDate , type ,reason , employeeId: req.user.id }); //req.user.id from auth.js
    const savedUser = await user.save();

    //admin
      const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

     // Find requesting user
    const requestingUser = await User.findById(req.user.id);
    // Email subject
    const subject = `Leave Request from ${requestingUser.name}`;

    // HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">New Leave Request</h2>
          <p><strong>Employee Name:</strong> ${requestingUser.name}</p>
          <p><strong>Email:</strong> ${requestingUser.email}</p>
          <p><strong>Leave Type:</strong> ${type}</p>
          <p><strong>From:</strong> ${new Date(fromDate).toDateString()}</p>
          <p><strong>To:</strong> ${new Date(toDate).toDateString()}</p>
          <p><strong>Reason:</strong><br/> ${reason}</p>

          <p style="margin-top: 30px;">Please log in to the admin dashboard to review and process this request.</p>

          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Leave Management System</p>
        </div>
      </div>
    `;

    // Send  email
    await sendEmail(admin.email, subject, '', html);


    res.json({ message: 'Leave Request Sended Sucessfully' });

    } catch (error) {
        console.log(error);
           res.status(500).json({ message: "Server Error", error: error.message });
    }
}


const cancelLeaveRequest =async(req,res)=>{

  try {
       const deletedLeave=  await LeaveRequest.findByIdAndDelete(req.params.id);
         if (!deletedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.log(error);
       res.status(500).json({ message: "Server Error", error: error.message });
  }
}


const ownLeaveHistory = async(req,res)=>{

  try {
    const leavesHistory = await LeaveRequest.find({ employeeId: req.user.id ,status:{$in:["pending","rejected"]} }).sort({ createdAt: -1 });
    if(leavesHistory){

      res.json(leavesHistory);
    }   
  } catch (error) {
       console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

const ApprovedLeaves = async(req,res)=>{

  try {
    const leavesHistory = await LeaveRequest.find({ employeeId: req.user.id,status:"accepted" }).sort({ createdAt: -1 });

       res.json(leavesHistory);
  } catch (error) {
       console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}



module.exports = {
  applyLeave,
  cancelLeaveRequest,
  ownLeaveHistory,
  ApprovedLeaves
}