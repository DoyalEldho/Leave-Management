const LeaveRequest = require('../model/LeaveRequest');
const User = require('../model/User');
const express = require('express');
const approveEmail = require('../utils/approveEmail');


const getAllLeave = async(req,res)=>{
     try {
   
       const leaves = await LeaveRequest.find({status:"pending"}).populate('employeeId', 'name email role').sort({ date: -1 });  //.populate(path, select)
       
       res.json(leaves);
   
     } catch (error) {
       console.log(error);
       res.status(500).json({ message: "Server Error", error: error.message });
     }
}

const filterEmployee = async (req, res) => {
  const { name } = req.body;

  try {
    const leaveRequests = await LeaveRequest.find()
      .populate({
        path: 'employeeId',
        match: name ? { name: { $regex: name, $options: 'i' } } : {},
        select: 'name email role',
      })
      .sort({ createdAt: -1 });

    //even though match use still get document with null values return
    const filtered = leaveRequests.filter(lr => lr.employeeId !== null);

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

//leaves summary
const getLeaveSummary = async (req, res) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1); 
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59); 
    const result = await LeaveRequest.aggregate([
      {
        $match: {
          status: "accepted", //  filter only approved leaves
          fromDate: { $gte: startOfYear, $lte: endOfYear }
        }
      },
    
      {
        $group: {
          _id: "$employeeId",
          totalDaysTaken: { $sum: "$days" }
        }
      },
      
      {
        $lookup: {
          from: "people",               
          localField: "_id",            // _id here is employeeId
          foreignField: "_id",          // _id in people collection
          as: "employee"
        }
      },
   
      {
        $unwind: "$employee"
      },
 
      {
        $addFields: {
          totalAllowed: 20,
          remaining: { $subtract: [20, "$totalDaysTaken"] }
        }
      },
   
      {
        $project: {
          _id: 0,
          name: "$employee.name",
          email: "$employee.email",
          role: "$employee.role",
          totalDaysTaken: 1,
          totalAllowed: 1,
          remaining: 1
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


//approve
const approveLeave = async (req, res) => {

      const { employeeId } = req.body;
  try {
    const approvedData = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "accepted" } },
      { new: true }
    );
    
    const findUser = await User.findOne({role:"user", _id:employeeId});   

    // Email subject
        const subject = 'Leave Request Approved';
    
        //html
           const htmlContent = `
      <h2>Hi ${findUser.name},</h2>
      <p>Your leave request for <strong>${approvedData.days}</strong> day(s), from 
      <strong>${new Date(approvedData.fromDate).toDateString()}</strong> to 
      <strong>${new Date(approvedData.toDate).toDateString()}</strong>, has been <span style="color:green;"><strong>Approved</strong></span>.</p>
    `;
          await approveEmail(findUser.email, subject, '', htmlContent);

    res.status(200).json({ message: "Leave approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


//reject
const rejectLeave = async (req, res) => {

      const { employeeId } = req.body;
  try {
    const rejectData = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "rejected" } },
      { new: true }
    );
    
    
    const findUser = await User.findOne({role:"user", _id:employeeId}); 

    // Email subject
        const subject = 'Leave Request Rejected';
    
        //html
           const htmlContent = `
      <h2>Hi ${findUser.name},</h2>
      <p>Your leave request for <strong>${rejectData.days}</strong> day(s), from 
      <strong>${new Date(rejectData.fromDate).toDateString()}</strong> to 
      <strong>${new Date(rejectData.toDate).toDateString()}</strong>, has been <span style="color:Red;"><strong>Rejected</strong></span>.</p>
    `;
          await approveEmail(findUser.email, subject, '', htmlContent);

    res.status(200).json({ message: "Leave Rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
 getAllLeave,
 filterEmployee,
 approveLeave,
 getLeaveSummary,
 rejectLeave
}