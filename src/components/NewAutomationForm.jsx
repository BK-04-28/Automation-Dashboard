import React, { useState } from 'react';

 function NewAutomationForm({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    triggerType: 'Daily',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
      <div className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: '500px' }}>
        <h4 className="mb-3">New Automation Rule</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="name"
              placeholder="Rule Name"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <select
              name="triggerType"
              onChange={handleChange}
              className="form-select"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Manual</option>
            </select>
          </div>
          <div className="mb-3">
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewAutomationForm

