import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import AttendanceForm from "./components/AttendanceForm";
import Reports from "./components/Reports";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="container my-4">
        <Routes>
          {/* Main Dashboard & Students View */}
          <Route
            path="/"
            element={
              <div>
                <Dashboard students={students} />
                <StudentForm onStudentAdded={fetchStudents} />
                <StudentTable
                  students={students}
                  loading={loading}
                  error={error}
                  onStudentDeleted={fetchStudents}
                />
              </div>
            }
          />
          <Route
            path="/students"
            element={
              <div>
                <Dashboard students={students} />
                <StudentForm onStudentAdded={fetchStudents} />
                <StudentTable
                  students={students}
                  loading={loading}
                  error={error}
                  onStudentDeleted={fetchStudents}
                />
              </div>
            }
          />

          {/* Mark Attendance View */}
          <Route
            path="/attendance"
            element={<AttendanceForm students={students} onAttendanceMarked={fetchStudents} />}
          />

          {/* Low Attendance Reports View */}
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container small text-muted">
          &copy; 2026 Department of Computer Science &amp; Engineering (AIML) &bull; Student Attendance Management System
        </div>
      </footer>
    </div>
  );
}
