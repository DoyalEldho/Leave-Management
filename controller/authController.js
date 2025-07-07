const User = require('../model/User');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
  const { name, email, password,role } = req.body;

  try {
    //  Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    //checking role
    if (!['admin', 'user'].includes(role)) {
  return res.status(403).json({ message: 'Invalid role' });
  }

    const hashPassword = await bcrypt.hash(password, 10);
    const users = new User({ name, email, password: hashPassword ,role });

    const saveDetails = await users.save();
    res.json({ message: 'Registered Sucessfully' });

  } catch (error) {
    res.status(500).json({ error: "Saving failed", details: error.message });
  }
};

const userLogin = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'user not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'password not matching' });

    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
      maxAge: 3600000,
    });

    res.json({ message: 'Login successful',role: user.role });

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }

}

module.exports = {
  userRegister,
  userLogin
}