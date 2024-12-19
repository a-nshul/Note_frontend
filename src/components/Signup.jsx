import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    // Basic Validation
    if (!form.name || !form.email || !form.password) {
      message.error('All fields are required!');
      return;
    }
  
    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(form.email)) {
      message.error('Please enter a valid email address');
      return;
    }
  
    // Password length validation
    if (form.password.length < 6) {
      message.error('Password must be at least 6 characters long');
      return;
    }
  
    try {
      setLoading(true); // Set loading to true before sending request
      const response = await axios.post('https://note-api-gii1.vercel.app/api/user', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
        message.success('Signup successful!');
        navigate('/');
    } catch (error) {
      // Handle any errors from the API
      console.error('Error during signup:', error);
      message.error('Something went wrong. Please try again!');
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        <Input
          size="large"
          placeholder="Name"
          prefix={<UserOutlined />}
          className="mb-4"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          size="large"
          placeholder="Email"
          prefix={<MailOutlined />}
          className="mb-4"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          className="mb-6"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          type="primary"
          size="large"
          block
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleSubmit}
          loading={loading} // Show loading spinner when the request is in progress
        >
          Sign Up
        </Button>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account? <a href="/" className="text-blue-500">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
