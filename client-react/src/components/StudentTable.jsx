import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// StudentTable Component (Unit III: List Rendering, Conditional Rendering, Events)
export default function StudentTable({ students = [], loading = false, error = "", onStudentDeleted }) {
  const navigate = useNavigate();
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleGotoAttendance = (rollNo, status) => {
    navigate(`/attendance?rollNo=${rollNo}&status=${status}`);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/students/${studentToDelete.rollNo}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudentToDelete(null);
      if (onStudentDeleted) onStudentDeleted();
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card shadow-sm p-3 border">
      <h4 className="fw-bold mb-3">Student Records</h4>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading && <div className="text-center text-muted py-3">Loading student records...</div>}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Roll</th>
                <th>Name</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance %</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No student records found. Add a student above.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  let badgeClass = "badge bg-secondary";
                  if (s.status === "Good") badgeClass = "badge bg-success";
                  if (s.status === "Low Attendance") badgeClass = "badge bg-danger";

                  return (
                    <tr key={s.rollNo}>
                      <td><strong>{s.rollNo}</strong></td>
                      <td>{s.name}</td>
                      <td className="text-success fw-bold">{s.present || 0}</td>
                      <td className="text-danger fw-bold">{s.absent || 0}</td>
                      <td><strong>{s.percentage !== undefined ? s.percentage : 0}%</strong></td>
                      <td><span className={badgeClass}>{s.status || "No Data"}</span></td>
                      <td>
                        <button className="btn btn-sm btn-success me-1" onClick={() => handleGotoAttendance(s.rollNo, "Present")}>Present</button>
                        <button className="btn btn-sm btn-danger me-1" onClick={() => handleGotoAttendance(s.rollNo, "Absent")}>Absent</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setStudentToDelete(s)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {studentToDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setStudentToDelete(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{studentToDelete.name}</strong> (Roll: {studentToDelete.rollNo})?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setStudentToDelete(null)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
