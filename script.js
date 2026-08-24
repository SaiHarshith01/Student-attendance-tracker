/**
 * Student Attendance Tracker - script.js
 * Full implementation with custom CSE-AIML configuration.
 * Demonstrating: OOP (Student Class), jQuery ($), Regex validations,
 * Type conversions, Arrow Functions, Returns, and HTTP POST simulation.
 */

// ==========================================
// 1. JAVASCRIPT OOP: STUDENT CLASS
// ==========================================
class Student {
    constructor(name, rollNo, email, gender, joiningDate, phone, present = 0, absent = 0) {
        this.name = name;
        this.rollNo = parseInt(rollNo); // Type Conversion
        this.email = email;
        this.gender = gender;
        this.joiningDate = joiningDate;
        this.phone = phone;
        this.present = parseInt(present);
        this.absent = parseInt(absent);
    }

    // Calculate attendance percentage using return statement
    calculateAttendance() {
        let totalClasses = this.present + this.absent;
        if (totalClasses === 0) {
            return 0; // return statement
        }
        let percentage = (this.present / totalClasses) * 100;
        return Math.round(percentage); // return statement
    }

    // Return attendance status based on 75% threshold
    getAttendanceStatus() {
        let percentage = this.calculateAttendance();
        return percentage >= 75 ? "Good" : "Low Attendance"; // return statement
    }
}

// ==========================================
// 2. GLOBAL DATA ARRAYS
// ==========================================
let studentsList = [];
let attendanceLogs = [];

// Populate default mockup students matching CSE-AIML details with roll 160124748054 as Low Attendance
const loadMockData = () => {
    studentsList.push(new Student("Amit Sharma", "160124748054", "amit@gmail.com", "Male", "2026-07-13", "9876543210", 10, 10));
    studentsList.push(new Student("Rohan Verma", "160124748073", "rohan@gmail.com", "Male", "2026-07-13", "9876543210", 18, 2));
    studentsList.push(new Student("Sanya Gupta", "160124748088", "sanya@gmail.com", "Female", "2026-07-13", "9876543210", 17, 3));

    let dateStr = "2026-07-13";
    attendanceLogs.push({ date: dateStr, studentRoll: 160124748054, studentName: "Amit Sharma", status: "Present" });
    attendanceLogs.push({ date: dateStr, studentRoll: 160124748073, studentName: "Rohan Verma", status: "Present" });
    attendanceLogs.push({ date: dateStr, studentRoll: 160124748088, studentName: "Sanya Gupta", status: "Absent" });
};

// ==========================================
// 3. ARROW FUNCTIONS FOR DOM MANIPULATION & LOGIC
// ==========================================

// Display alerts using jQuery $
const showAlert = (type, message) => {
    let alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#alertPlaceholder").html(alertHtml);
    setTimeout(() => { $(".alert").alert('close'); }, 4000);
};

const showAttendanceAlert = (type, message) => {
    let alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $("#attendanceAlertPlaceholder").html(alertHtml);
    setTimeout(() => { $("#attendanceAlertPlaceholder .alert").alert('close'); }, 4000);
};

// Update Dashboard cards using jQuery $
const updateDashboard = () => {
    let totalCount = studentsList.length;
    $("#totalStudents").text(totalCount); // jQuery $ DOM manipulation

    // Get today's attendance details (default date 13 July 2026)
    let defaultDate = "2026-07-13";
    let todayLogs = attendanceLogs.filter(log => log.date === defaultDate);

    let presentToday = todayLogs.filter(log => log.status === "Present").length;
    let absentToday = todayLogs.filter(log => log.status === "Absent").length;

    $("#presentToday").text(presentToday);
    $("#absentToday").text(absentToday);

    // Calculate Average Attendance
    if (totalCount === 0) {
        $("#avgAttendance").text("0%");
        return;
    }

    let sum = 0;
    studentsList.forEach(s => {
        sum += s.calculateAttendance();
    });
    let avg = Math.round(sum / totalCount);
    $("#avgAttendance").text(avg + "%"); // jQuery $ DOM manipulation
};

// Render Students Table using jQuery $ (No Department column)
const renderStudentTable = () => {
    let tbody = $("#studentTableBody");
    tbody.empty(); // jQuery $ DOM manipulation

    if (studentsList.length === 0) {
        tbody.append(`
            <tr id="emptyRow">
                <td colspan="7" class="text-center text-muted py-4">No student records found.</td>
            </tr>
        `);
        return;
    }

    studentsList.forEach(student => {
        let attendancePct = student.calculateAttendance();
        let status = student.getAttendanceStatus();
        let statusClass = status === "Good" ? "status-good" : "status-low";

        // Minimal Status Alert Column - Emojis/Symbols removed
        let row = `
            <tr data-roll="${student.rollNo}">
                <td><strong>${student.rollNo}</strong></td>
                <td>${student.name}</td>
                <td class="text-success fw-bold">${student.present}</td>
                <td class="text-danger fw-bold">${student.absent}</td>
                <td><strong>${attendancePct}%</strong></td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-success btn-present-click me-1" data-roll="${student.rollNo}">Present</button>
                    <button class="btn btn-sm btn-danger btn-absent-click me-1" data-roll="${student.rollNo}">Absent</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-click" data-roll="${student.rollNo}" data-name="${student.name}">Delete</button>
                </td>
            </tr>
        `;
        tbody.append(row); // jQuery $ DOM manipulation
    });
};

// Render Student select options in Attendance section
const renderAttendanceDropdown = () => {
    let select = $("#selectStudent");
    select.html('<option value="" selected disabled>Select Student</option>'); // jQuery $ DOM manipulation
    
    studentsList.forEach(student => {
        select.append(`<option value="${student.rollNo}">${student.name} (Roll: ${student.rollNo})</option>`);
    });
};

// Render Attendance History Table
const renderAttendanceHistory = () => {
    let tbody = $("#historyTableBody");
    tbody.empty(); // jQuery $ DOM manipulation

    if (attendanceLogs.length === 0) {
        tbody.append(`
            <tr id="emptyHistoryRow">
                <td colspan="3" class="text-center text-muted py-3">No history logs recorded yet.</td>
            </tr>
        `);
        return;
    }

    // Show logs in reverse order (latest first)
    let reversedLogs = [...attendanceLogs].reverse();
    reversedLogs.forEach(log => {
        let statusBadge = log.status === "Present" ? "bg-success" : "bg-danger";
        tbody.append(`
            <tr>
                <td><code>${log.date}</code></td>
                <td>${log.studentName} (Roll: ${log.studentRoll})</td>
                <td><span class="badge ${statusBadge}">${log.status}</span></td>
            </tr>
        `);
    });
};

// Update all UI elements
const updateUI = () => {
    updateDashboard();
    renderStudentTable();
    renderAttendanceDropdown();
    renderAttendanceHistory();
};

// ==========================================
// 4. ACTION HANDLERS (ARROW FUNCTIONS)
// ==========================================

// Mark Present
const markPresent = (rollNo) => {
    let student = studentsList.find(s => s.rollNo === parseInt(rollNo)); // return statement in find callback
    if (student) {
        student.present += 1;
        updateUI();
    }
};

// Mark Absent
const markAbsent = (rollNo) => {
    let student = studentsList.find(s => s.rollNo === parseInt(rollNo)); // return statement in find callback
    if (student) {
        student.absent += 1;
        updateUI();
    }
};

// Reset Form fields using jQuery $ (date set back to 13 July 2026)
const resetForm = () => {
    $("#studentForm")[0].reset(); // jQuery reference
    $("#joiningDate").val("2026-07-13");
};

// ==========================================
// 5. REGULAR EXPRESSION VALIDATIONS
// ==========================================
const validateForm = (name, rollNo, email, phone, date, gender) => {
    // A. Student Name Regex (letters and spaces only)
    let nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
        showAlert("danger", "Please enter a valid Student Name (Letters and spaces only).");
        return false; // return statement
    }

    // B. Roll Number check
    let rollInt = parseInt(rollNo);
    if (isNaN(rollInt) || rollInt <= 0 || rollNo.includes('.')) {
        showAlert("danger", "Please enter a valid positive Integer Roll Number.");
        return false; // return statement
    }

    // C. Email Regex Validation
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showAlert("danger", "Please enter a valid Email Address.");
        return false; // return statement
    }

    // D. Gender Radio Button Selection Check
    if (!gender) {
        showAlert("danger", "Please select a Gender.");
        return false; // return statement
    }

    // E. Date Selection Check
    if (!date) {
        showAlert("danger", "Please select a Date.");
        return false; // return statement
    }

    // F. Phone Number Regex (Exactly 10 digits)
    let phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showAlert("danger", "Please enter a valid 10-digit Phone Number.");
        return false; // return statement
    }

    return true; // return statement
};


// ==========================================
// 6. INITIALIZATION & JQUERY EVENT HANDLERS
// ==========================================
$(document).ready(() => {
    // Load initial mockup data
    loadMockData();
    updateUI();

    // Default dates to 13 July 2026
    let defaultDate = "2026-07-13";
    $("#joiningDate").val(defaultDate);
    $("#attendanceDate").val(defaultDate);

    // Reset button click event using jQuery $
    $("#resetBtn").on("click", () => {
        resetForm();
    });

    // Form Submission: Add Student
    $("#studentForm").on("submit", (e) => {
        e.preventDefault(); // Prevents standard browser POST reload behavior

        // Reading form input values using jQuery $
        let name = $("#studentName").val().trim();
        let rollNo = $("#rollNo").val().trim();
        let email = $("#email").val().trim();
        let gender = $("input[name='gender']:checked").val();
        let date = $("#joiningDate").val();
        let phone = $("#phone").val().trim();

        // Perform validations using Regex & check return value
        if (!validateForm(name, rollNo, email, phone, date, gender)) {
            return; // return statement
        }

        // Duplicate Roll Number check
        let rollInt = parseInt(rollNo);
        let exists = studentsList.some(s => s.rollNo === rollInt);
        if (exists) {
            showAlert("danger", `Student with Roll Number ${rollNo} already exists!`);
            return; // return statement
        }

        // Construct payload parameters for POST method demonstration
        let studentPayload = {
            name: name,
            rollNo: parseInt(rollNo), // Type Conversion
            email: email,
            gender: gender,
            joiningDate: date,
            phone: phone
        };

        // ==========================================
        // 7. POST METHOD DEMONSTRATION
        // ==========================================
        // Send student data using HTTP POST request to a public mock endpoint
        $.post("https://httpbin.org/post", studentPayload)
            .done((response) => {
                console.log("POST Success! Data mirrored from server:", response.json);

                // OOP: Create Student Class Instance
                let newStudent = new Student(name, rollNo, email, gender, date, phone);
                studentsList.push(newStudent);
                showAlert("success", `New student "${name}" added successfully!`);

                resetForm();
                updateUI();
            })
            .fail(() => {
                showAlert("danger", "Mock POST Request failed. Please check internet connection.");
            });
    });

    // Handle Quick Action Buttons (Using jQuery delegation for dynamic elements)

    // Present button click event using jQuery $
    $("#studentTableBody").on("click", ".btn-present-click", function () {
        let roll = $(this).data("roll");
        markPresent(roll);
    });

    // Absent button click event using jQuery $
    $("#studentTableBody").on("click", ".btn-absent-click", function () {
        let roll = $(this).data("roll");
        markAbsent(roll);
    });

    // Delete button click event using jQuery $ (uses native confirm alert dialog instead of modal)
    $("#studentTableBody").on("click", ".btn-delete-click", function () {
        let roll = $(this).data("roll");
        let name = $(this).data("name");

        let confirmDelete = confirm(`Are you sure you want to delete ${name} (Roll No: ${roll})?`);
        if (confirmDelete) {
            studentsList = studentsList.filter(s => s.rollNo !== parseInt(roll));
            attendanceLogs = attendanceLogs.filter(log => log.studentRoll !== parseInt(roll));
            updateUI();
            showAlert("success", `Student ${name} deleted successfully.`);
        }
    });

    // Mark Attendance Form Submission using jQuery $
    $("#attendanceForm").on("submit", (e) => {
        e.preventDefault(); // Prevents normal POST page reload

        let rollNo = $("#selectStudent").val();
        let date = $("#attendanceDate").val();
        let status = $("input[name='attendanceStatus']:checked").val();

        if (!rollNo || !date) {
            showAttendanceAlert("danger", "Please select a student and date.");
            return;
        }

        let student = studentsList.find(s => s.rollNo === parseInt(rollNo));
        if (!student) return;

        // Structured POST payload
        let attendancePayload = {
            studentRoll: parseInt(rollNo),
            date: date,
            status: status
        };

        // ==========================================
        // POST METHOD DEMONSTRATION (ATTENDANCE LOG)
        // ==========================================
        $.post("https://httpbin.org/post", attendancePayload)
            .done((response) => {
                console.log("Attendance POST successful! Mirrored data:", response.json);

                // Add to local history list
                attendanceLogs.push({
                    date: date,
                    studentRoll: student.rollNo,
                    studentName: student.name,
                    status: status
                });

                // Update tallies locally
                if (status === "Present") {
                    student.present++;
                } else {
                    student.absent++;
                }

                showAttendanceAlert("success", `Attendance for <strong>${student.name}</strong> marked as ${status}!`);
                $("#selectStudent").val("");
                updateUI();
            })
            .fail(() => {
                showAttendanceAlert("danger", "Failed to mark attendance. Check network connection.");
            });
    });
});