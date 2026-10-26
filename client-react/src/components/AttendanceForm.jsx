import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// AttendanceForm Component (Unit III: useSearchParams, useEffect, useState, Controlled Form)
export default function AttendanceForm({ students = [], onAttendanceMarked }) {
  const [searchParams] = useSearchParams();
  const today = new Date().toISOString().split("T")[0];

  const paramRoll = searchParams.get("rollNo") || "";
  const paramStatus = searchParams.get("status") || "Present";

  const [rollNo, setRollNo] = useState(paramRoll);
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState(paramStatus);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  // History state
  const [logs, setLogs] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (paramRoll) setRollNo(paramRoll);
    if (paramStatus) setStatus(paramStatus);
  }, [paramRoll, paramStatus]);

  const loadHistory = async (d = "") => {
    setHistoryLoading(true);
    try {
      const url = d ? `/api/attendance?date=${d}` : "/api/attendance";
      const res = await fetch(url);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setLogs([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(filterDate);
  }, [filterDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    if (!rollNo) return setMsg({ text: "Please select a student", type: "danger" });

    setLoading(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo: parseInt(rollNo), date, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark attendance");

      setMsg({ text: data.message, type: "success" });
      loadHistory(filterDate);
      if (onAttendanceMarked) onAttendanceMarked();
    } catch (err) {
      setMsg({ text: err.message, type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-5 mb-4">
        <div className="card shadow-sm p-4 border">
          <h4 className="fw-bold mb-3">Mark Daily Attendance</h4>
          {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Student</label>
              <select className="form-select" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required>
                <option value="" disabled>Select Student</option>
                {students.map((s) => (
                  <option key={s.rollNo} value={s.rollNo}>{s.name} (Roll: {s.rollNo})</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Date</label>
              <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold d-block">Status</label>
              {["Present", "Absent"].map((st) => (
                <div key={st} className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="status" value={st} checked={status === st} onChange={(e) => setStatus(e.target.value)} />
                  <label className="form-check-label">{st}</label>
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
          </form>
        </div>
      </div>

      <div className="col-md-7">
        <div className="card shadow-sm p-3 border">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Attendance History</h4>
            <input type="date" className="form-control form-control-sm w-auto" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>

          {historyLoading ? (
            <div className="text-center text-muted py-3">Loading history...</div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr><th>Date</th><th>Student (Roll)</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan="3" className="text-center text-muted py-3">No history logs recorded.</td></tr>
                  ) : (
                    logs.map((log, i) => (
                      <tr key={i}>
                        <td><code>{new Date(log.date).toISOString().split("T")[0]}</code></td>
                        <td>{log.name} (Roll: {log.rollNo})</td>
                        <td><span className={`badge ${log.status === "Present" ? "bg-success" : "bg-danger"}`}>{log.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
