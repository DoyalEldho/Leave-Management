import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPass(!showPass);

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', data);
      alert("Registered Sucessfully");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-200  flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Register Logo" className="w-20 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-green-900">Register</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                          type="email"
                          {...register('email', {
                              required: 'Email is required',
                              pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: 'Enter a valid email address'
                              }
                          })}
                          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>


                  <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                          type={showPass ? 'text' : 'password'}
                          {...register('password', {
                              required: 'Password is required'
                          })}
                          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          placeholder="Enter password"
                      />
                      <span onClick={togglePassword} className="absolute top-9 right-3 text-gray-500 cursor-pointer">
                          {showPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                      </span>
                      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-purple-600 font-medium">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
