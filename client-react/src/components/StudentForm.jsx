import React, { useState } from "react";

// StudentForm Component (Unit III: Controlled Forms, useState, Regex Validation)
export default function StudentForm({ onStudentAdded }) {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    gender: "Male",
    joiningDate: today,
    phone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
      return "Name must contain only letters and spaces (2-50 chars).";
    }
    const roll = parseInt(formData.rollNo);
    if (isNaN(roll) || roll <= 0) {
      return "Please enter a valid positive Integer Roll Number.";
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rollNo: parseInt(formData.rollNo) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create student");

      setSuccess(`Student "${formData.name}" added successfully!`);
      setFormData({ name: "", rollNo: "", email: "", gender: "Male", joiningDate: today, phone: "" });
      if (onStudentAdded) onStudentAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4 border">
      <h4 className="fw-bold mb-3">Add Student</h4>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <form onSubmit={handleSubmit} novalidate="true">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Student Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Roll Number</label>
            <input type="number" className="form-control" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold d-block">Gender</label>
            <div className="pt-2">
              {["Male", "Female", "Other"].map((g) => (
                <div key={g} className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} />
                  <label className="form-check-label">{g}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Date of Joining</label>
            <input type="date" className="form-control" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}
