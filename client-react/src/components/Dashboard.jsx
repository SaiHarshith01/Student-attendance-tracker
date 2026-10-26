import React from "react";

// Dashboard Component (Unit III: Functional Components, Props)
export default function Dashboard({ students = [] }) {
  let totalPresent = 0;
  let totalAbsent = 0;
  let pctSum = 0;
  let studentsWithData = 0;

  students.forEach((s) => {
    totalPresent += s.present || 0;
    totalAbsent += s.absent || 0;
    if (s.total > 0) {
      pctSum += s.percentage || 0;
      studentsWithData++;
    }
  });

  const avgAttendance = studentsWithData > 0 ? Math.round(pctSum / studentsWithData) : 0;

  return (
    <div className="mb-4">
      <h3 className="fw-bold mb-3">Attendance Dashboard</h3>
      <div className="row">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center shadow-sm p-3 border">
            <div className="display-6 fw-bold text-primary">{students.length}</div>
            <div className="text-muted fw-semibold small">Total Students</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center shadow-sm p-3 border">
            <div className="display-6 fw-bold text-success">{totalPresent}</div>
            <div className="text-muted fw-semibold small">Present Records</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center shadow-sm p-3 border">
            <div className="display-6 fw-bold text-danger">{totalAbsent}</div>
            <div className="text-muted fw-semibold small">Absent Records</div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center shadow-sm p-3 border">
            <div className="display-6 fw-bold text-info">{avgAttendance}%</div>
            <div className="text-muted fw-semibold small">Avg Attendance</div>
          </div>
        </div>
      </div>
    </div>
  );
}
