// src/App.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8080/users'

function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '' })
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL)
      setUsers(res.data)
    } catch (err) {
      alert('Error fetching users: ' + err.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle input change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Add new user
  const handleAdd = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email are required')
      return
    }
    try {
      await axios.post(API_URL, form)
      setForm({ name: '', email: '' })
      fetchUsers()
    } catch (err) {
      alert('Error adding user: ' + err.message)
    }
  }

  // Set editing user
  const startEdit = user => {
    setEditingId(user.id)
    setForm({ name: user.name, email: user.email })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', email: '' })
  }

  // Update user
  const handleUpdate = async e => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email are required')
      return
    }
    try {
      await axios.put(`${API_URL}/${editingId}`, form)
      setEditingId(null)
      setForm({ name: '', email: '' })
      fetchUsers()
    } catch (err) {
      alert('Error updating user: ' + err.message)
    }
  }

  // Delete user
  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        fetchUsers()
      } catch (err) {
        alert('Error deleting user: ' + err.message)
      }
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app-container">
      <h1 className="mb-4 text-center">User Management</h1>

      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-sm-5">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-5">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2 d-grid">
            <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`}>
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
        {editingId && (
          <div className="mt-2">
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Cancel Edit
            </button>
          </div>
        )}
      </form>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ minWidth: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found
                </td>
              </tr>
            )}
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => startEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
