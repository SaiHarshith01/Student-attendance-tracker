import React, { useState, useEffect } from "react";

// Reports Component (Unit III: useEffect, API Data Fetching, Conditional Rendering)
export default function Reports() {
  const [lowStudents, setLowStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLowAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/students/low");
      if (!res.ok) throw new Error("Failed to fetch low attendance report");
      const data = await res.json();
      setLowStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowAttendance();
  }, []);

  return (
    <div className="card shadow-sm p-4 border">
      <h4 className="fw-bold mb-2 text-danger">Students with Low Attendance (&lt; 75%)</h4>
      <p className="text-muted small mb-3">
        Students currently below the minimum mandatory attendance threshold of 75%.
      </p>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading && <div className="text-center text-muted py-3">Loading low attendance report...</div>}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-danger">
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Present</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No students with low attendance. All enrolled students are &ge; 75% or have no records yet.
                  </td>
                </tr>
              ) : (
                lowStudents.map((s) => (
                  <tr key={s.rollNo}>
                    <td><strong>{s.rollNo}</strong></td>
                    <td>{s.name}</td>
                    <td className="text-success fw-bold">{s.present}</td>
                    <td>{s.total}</td>
                    <td className="text-danger fw-bold">{s.percentage}%</td>
                    <td><span className="badge bg-danger">{s.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
