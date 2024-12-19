import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://note-api-gii1.vercel.app/api/note', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setNotes(response.data.notes);
      setFilteredNotes(response.data.notes);
    } catch (error) {
      message.error('Failed to fetch notes!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    message.success('Logged out successfully!');
    navigate('/');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (value) {
      const filtered = notes.filter((note) =>
        note.category.toLowerCase().includes(value)
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (isEdit) {
        await axios.put(`https://note-api-gii1.vercel.app/api/note/${selectedNote._id}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        message.success('Note updated successfully!');
      } else {
        await axios.post('https://note-api-gii1.vercel.app/api/note', values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        message.success('Note added successfully!');
      }
      fetchNotes();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Error saving note!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setIsEdit(true);
    form.setFieldsValue(note);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`https://note-api-gii1.vercel.app/api/note/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      message.success('Note deleted successfully!');
      fetchNotes();
    } catch (error) {
      message.error('Error deleting note!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Content', dataIndex: 'content', key: 'content' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="bg-blue-500 hover:bg-blue-600"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            className="bg-red-500 hover:bg-red-600"
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div
        className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-lg p-8 max-w-4xl w-full`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Notes</h2>
          <div className="flex items-center space-x-4">
            <Button
              icon={<LogoutOutlined />}
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <div className="flex items-center space-x-2">
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              <Switch
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="bg-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by category"
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/2"
          />
          <Button
            type="primary"
            size="large"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => {
              setIsEdit(false);
              setSelectedNote(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Note
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredNotes}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
        <Modal
          visible={modalVisible}
          title={isEdit ? 'Edit Note' : 'Add Note'}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter the content' }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category' }]}>
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
              {isEdit ? 'Update' : 'Add'} Note
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Notes;
