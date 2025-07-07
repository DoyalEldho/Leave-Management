import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves, submitLeave, cancelLeave } from '../../feature/leaveSlice';
import { Link } from 'react-router-dom';



const LeaveDashboard = () => {
    const dispatch = useDispatch();
    const { history: leaveHistory, status, error } = useSelector(state => state.leave);

    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        type: 'sick',
        reason: '',
    });

    useEffect(() => {

        dispatch(fetchLeaves()) //return promise
        .unwrap()
        .catch((err) => {
           console.error("Error fetching leave history:", err);
            });
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(submitLeave(formData));
        setFormData({ fromDate: '', toDate: '', type: 'sick', reason: '' });
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Leave Request Form</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>From Date:</label>
                    <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>To Date:</label>
                    <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Leave Type:</label>
                    <select name="type" value={formData.type} onChange={handleChange} required style={styles.input}>
                        <option value="sick">Sick</option>
                        <option value="casual">Casual</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Reason:</label>
                    <textarea name="reason" value={formData.reason} onChange={handleChange} required style={{ ...styles.input, height: '80px' }} />
                </div>
                <button type="submit" style={styles.button}>Submit Leave Request</button>
            </form>

            <hr style={{ margin: '2rem 0' }} />

            <h3 style={styles.subtitle}>Leave History</h3>

            {/* view leaves */}
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Link to="/all-leaves"
                    style={{
                        fontWeight: 'bold',
                        color: '#007bff',
                        textDecoration: 'none',
                    }}
                    onMouseOver={e => e.target.style.color = '#0056b3'}
                    onMouseOut={e => e.target.style.color = '#007bff'}
                >View Leaves</Link>
            </div>

            {status === 'loading' && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* data */}
            {Array.isArray(leaveHistory) && leaveHistory.length === 0 ? (
                <p style={styles.message}>No leave requests found.</p>
            ) : (
                <ul style={styles.historyList}>
                    {leaveHistory.map(leave => (
                        <li key={leave._id} style={styles.historyItem}>
                            <p><strong>{leave.type.toUpperCase()} Leave</strong></p>
                            <p>From: {new Date(leave.fromDate).toLocaleDateString()} To: {new Date(leave.toDate).toLocaleDateString()}</p>
                            <p>Reason: {leave.reason}</p>
                            <p>Status: <strong style={{
                                color: leave.status === 'pending' ? '#f0a500' : 'red'
                            }}>{leave.status.toUpperCase()}</strong></p>

                            {leave.status === 'pending' && (
                                <button style={styles.cancelButton} onClick={() => dispatch(cancelLeave(leave._id))}>
                                    Cancel Request
                                </button>
                            )}
                        </li>
                    ))}

                </ul>
            )}
        </div>
    );
};

export default LeaveDashboard;

const styles = {
    container: {
        maxWidth: 600,
        margin: 'auto',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        color: '#333'
    },
    subtitle: {
        marginTop: '2rem',
        color: '#444'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        marginBottom: '.3rem',
        fontWeight: 'bold',
        color: '#555'
    },
    input: {
        padding: '.5rem',
        border: '1px solid #ccc',
        borderRadius: 5,
        fontSize: '1rem'
    },
    button: {
        padding: '.7rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
    },
    historyList: {
        listStyle: 'none',
        padding: 0
    },
    historyItem: {
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: 5,
        border: '1px solid #ddd'
    },
    cancelButton: {
        marginTop: '.5rem',
        padding: '.5rem .8rem',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer'
    },
    message: {
        textAlign: 'center',
        color: '#666'
    }
};
