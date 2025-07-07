import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approvedLeaves } from '../../feature/leaveSlice';
import './viewLeaves.css'; 

const ViewLeaves = () => {
  const dispatch = useDispatch();
  const { summary: leaveSummary, status, error } = useSelector(state => state.approvedLeaves);

  useEffect(() => {
    dispatch(approvedLeaves())
    .unwrap()
    .then(data =>console.log(data));
    
  }, [dispatch]);

  return (
    <div className="leave-container">
      <h2 className="leave-title">Leave Summary</h2>

      {status === 'loading' && <p className="loading">Loading...</p>}
      {status === 'failed' && <p className="error">Error: {error}</p>}
      {status === 'succeeded' && leaveSummary.length === 0 && <p className="no-data">No approved leaves found.</p>}

      {status === 'succeeded' && leaveSummary.length > 0 && (
        <table className="leave-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Type</th>
              <th>Reason</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveSummary.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.type}</td>
                <td>{leave.reason}</td>
                <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                <td>{leave.days}</td>
                <td>
                  <span className={`status-badge ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewLeaves;
