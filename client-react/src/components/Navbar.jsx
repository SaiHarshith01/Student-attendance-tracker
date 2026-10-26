import React from "react";
import { NavLink } from "react-router-dom";

// Navbar Component (Unit I: Bootstrap Navbar, Unit III: React Router NavLink)
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <span className="navbar-brand fw-bold">CSE-AIML Student Attendance Tracker</span>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className={({ isActive }) => "nav-link " + (isActive ? "active text-white fw-bold" : "")} to="/">
                Students & Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => "nav-link " + (isActive ? "active text-white fw-bold" : "")} to="/attendance">
                Mark Attendance
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => "nav-link " + (isActive ? "active text-white fw-bold" : "")} to="/reports">
                Low Attendance Reports
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
