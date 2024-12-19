import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For React Router, use useRouter for Next.js

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      message.error('All fields are required!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://note-api-gii1.vercel.app/api/user/login', form);

      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store token in localStorage
        message.success('Login successful!');
        navigate('/notes'); // Redirect to notes page
      } else {
        message.error('Invalid credentials!');
      }
    } catch (error) {
      message.error('Error during login. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Log In</h2>
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
          className="bg-green-500 hover:bg-green-600"
          onClick={handleSubmit}
          loading={loading}
        >
          Log In
        </Button>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account? <a href="/signup" className="text-green-500">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
