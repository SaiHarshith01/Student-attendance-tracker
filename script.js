/**
 * Student Attendance Tracker - script.js
 * Full implementation using: HTML5, CSS Box Model, Bootstrap 5 components,
 * JavaScript OOP (Student Class), jQuery ($) DOM selectors/events,
 * Regular Expressions (Regex) validations, Type conversions, Arrow Functions,
 * returns, and HTTP POST method demonstration.
 */

// ==========================================
// 1. JAVASCRIPT OOP: STUDENT CLASS
// ==========================================
class Student {
    constructor(name, rollNo, email, department, gender, joiningDate, phone, present = 0, absent = 0) {
        this.name = name;
        this.rollNo = parseInt(rollNo); // Type Conversion (String to Number)
        this.email = email;
        this.department = department;
        this.gender = gender;
        this.joiningDate = joiningDate;
        this.phone = phone;
        this.present = parseInt(present);
        this.absent = parseInt(absent);
    }

    // Method to calculate attendance percentage using return statement
    calculateAttendance() {
        let totalClasses = this.present + this.absent;
        if (totalClasses === 0) {
            return 0; // return statement
        }
        let percentage = (this.present / totalClasses) * 100;
        return Math.round(percentage); // return statement
    }

    // Method to return attendance status based on 75% threshold
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

// Populate default mockup students
const loadMockData = () => {
    studentsList.push(new Student("Rahul Kumar", 101, "rahul@gmail.com", "CSE", "Male", "2026-08-24", "9876543210", 18, 2));
    studentsList.push(new Student("Priya Sharma", 102, "priya@gmail.com", "CSE", "Female", "2026-08-24", "9876543210", 16, 4));
    studentsList.push(new Student("Arjun Reddy", 103, "arjun@gmail.com", "ECE", "Male", "2026-08-24", "9876543210", 12, 8));

    let todayStr = new Date().toISOString().split('T')[0];
    attendanceLogs.push({ date: todayStr, studentRoll: 101, studentName: "Rahul Kumar", status: "Present" });
    attendanceLogs.push({ date: todayStr, studentRoll: 102, studentName: "Priya Sharma", status: "Present" });
    attendanceLogs.push({ date: todayStr, studentRoll: 103, studentName: "Arjun Reddy", status: "Absent" });
};

// ==========================================
// 3. ARROW FUNCTIONS FOR DOM MANIPULATION & LOGIC
// ==========================================

// Display top alerts using jQuery $
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
        <div class="alert alert-${type} alert-dismissible fade show animate-fade" role="alert">
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

    // Get today's attendance details
    let todayStr = new Date().toISOString().split('T')[0];
    let todayLogs = attendanceLogs.filter(log => log.date === todayStr);

    let presentToday = todayLogs.filter(log => log.status === "Present").length;
    let absentToday = todayLogs.filter(log => log.status === "Absent").length;

    $("#presentToday").text(presentToday); // jQuery $ DOM manipulation
    $("#absentToday").text(absentToday);   // jQuery $ DOM manipulation

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

// Render Students Table using jQuery $
const renderStudentTable = (filteredList = studentsList) => {
    let tbody = $("#studentTableBody");
    tbody.empty(); // jQuery $ DOM manipulation

    if (filteredList.length === 0) {
        tbody.append(`
            <tr id="emptyRow">
                <td colspan="8" class="text-center text-muted py-4">No student records found.</td>
            </tr>
        `);
        return;
    }

    filteredList.forEach(student => {
        let attendancePct = student.calculateAttendance();
        let status = student.getAttendanceStatus();
        let statusClass = status === "Good" ? "status-good" : "status-low";
        let statusIcon = status === "Good" ? "✓" : "⚠";

        let row = `
            <tr data-roll="${student.rollNo}">
                <td><strong>${student.rollNo}</strong></td>
                <td>${student.name}</td>
                <td><span class="badge bg-secondary">${student.department}</span></td>
                <td class="text-success fw-bold">${student.present}</td>
                <td class="text-danger fw-bold">${student.absent}</td>
                <td><strong>${attendancePct}%</strong></td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusIcon} ${status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-success btn-present-click me-1" data-roll="${student.rollNo}">Present</button>
                    <button class="btn btn-sm btn-danger btn-absent-click me-1" data-roll="${student.rollNo}">Absent</button>
                    <button class="btn btn-sm btn-primary btn-edit-click me-1" data-roll="${student.rollNo}">Edit</button>
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

// Delete Student
const deleteStudent = (rollNo) => {
    studentsList = studentsList.filter(s => s.rollNo !== parseInt(rollNo));
    // Filter attendance history too
    attendanceLogs = attendanceLogs.filter(log => log.studentRoll !== parseInt(rollNo));
    updateUI();
    showAlert("success", `Student roll number ${rollNo} deleted successfully.`);
};

// Reset Form fields using jQuery $
const resetForm = () => {
    $("#studentForm")[0].reset(); // jQuery form reference access
    $("#editMode").val("false");
    $("#originalRollNo").val("");
    $("#formTitle").text("Add Student");
    $("#submitBtn").text("Add Student").removeClass("btn-warning").addClass("btn-primary");
    $("#rollNo").prop("readonly", false);
};

// ==========================================
// 5. REGULAR EXPRESSION VALIDATIONS
// ==========================================
const validateForm = (name, rollNo, email, phone, date, gender) => {
    // A. Student Name Regex (letters and spaces only, length 2 to 50)
    let nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name)) {
        showAlert("danger", "Please enter a valid Student Name (Letters and spaces only, 2-50 characters).");
        return false; // return statement
    }

    // B. Roll Number check (Integer conversion validation)
    let rollInt = parseInt(rollNo);
    if (isNaN(rollInt) || rollInt <= 0 || rollNo.includes('.')) {
        showAlert("danger", "Please enter a valid positive Integer Roll Number.");
        return false; // return statement
    }

    // C. Email Regex Validation
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showAlert("danger", "Please enter a valid Email Address (e.g. rahul@gmail.com).");
        return false; // return statement
    }

    // D. Department Required Check
    if (!$("#department").val()) {
        showAlert("danger", "Please select a Department from the list.");
        return false; // return statement
    }

    // E. Gender Radio Button Selection Check
    if (!gender) {
        showAlert("danger", "Please select a Gender.");
        return false; // return statement
    }

    // F. Date Selection Check
    if (!date) {
        showAlert("danger", "Please select a Date of Joining.");
        return false; // return statement
    }

    // G. Phone Number Regex (Exactly 10 digits)
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

    // Default dates to current date
    let todayStr = new Date().toISOString().split('T')[0];
    $("#joiningDate").val(todayStr);
    $("#attendanceDate").val(todayStr);

    // Reset button click event using jQuery $
    $("#resetBtn").on("click", () => {
        resetForm();
        $("#joiningDate").val(todayStr);
    });

    // Form Submission: Add or Update Student
    $("#studentForm").on("submit", (e) => {
        e.preventDefault(); // Prevents standard browser POST reload behavior

        // Reading form input values using jQuery $
        let name = $("#studentName").val().trim();
        let rollNo = $("#rollNo").val().trim();
        let email = $("#email").val().trim();
        let department = $("#department").val();
        let gender = $("input[name='gender']:checked").val();
        let date = $("#joiningDate").val();
        let phone = $("#phone").val().trim();

        let isEdit = $("#editMode").val() === "true";
        let origRoll = $("#originalRollNo").val();

        // Perform validations using Regex & check return value
        if (!validateForm(name, rollNo, email, phone, date, gender)) {
            return; // return statement
        }

        // Duplicate Roll Number check (for new insertions)
        if (!isEdit) {
            let rollInt = parseInt(rollNo);
            let exists = studentsList.some(s => s.rollNo === rollInt);
            if (exists) {
                showAlert("danger", `Student with Roll Number ${rollNo} already exists!`);
                return; // return statement
            }
        }

        // Construct payload parameters for POST method demonstration
        let studentPayload = {
            name: name,
            rollNo: parseInt(rollNo), // Type Conversion
            email: email,
            department: department,
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

                if (isEdit) {
                    // Update Student details inside global list
                    let student = studentsList.find(s => s.rollNo === parseInt(origRoll));
                    if (student) {
                        student.name = name;
                        student.email = email;
                        student.department = department;
                        student.gender = gender;
                        student.joiningDate = date;
                        student.phone = phone;
                        showAlert("success", `Details of student "${name}" updated successfully!`);
                    }
                } else {
                    // OOP: Create Student Class Instance
                    let newStudent = new Student(name, rollNo, email, department, gender, date, phone);
                    studentsList.push(newStudent);
                    showAlert("success", `New student "${name}" added successfully!`);
                }

                resetForm();
                updateUI();
                $("#joiningDate").val(todayStr);
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

    // Edit button click event using jQuery $
    $("#studentTableBody").on("click", ".btn-edit-click", function () {
        let roll = $(this).data("roll");
        let student = studentsList.find(s => s.rollNo === parseInt(roll));
        
        if (student) {
            // Fill inputs using jQuery $
            $("#studentName").val(student.name);
            $("#rollNo").val(student.rollNo).prop("readonly", true); // Disable roll edit
            $("#email").val(student.email);
            $("#department").val(student.department);
            $(`input[name="gender"][value="${student.gender}"]`).prop("checked", true);
            $("#joiningDate").val(student.joiningDate);
            $("#phone").val(student.phone);

            // Change UI text
            $("#formTitle").text("Edit Student Details");
            $("#submitBtn").text("Update Student").removeClass("btn-primary").addClass("btn-warning");

            // Set tracker hidden values
            $("#editMode").val("true");
            $("#originalRollNo").val(student.rollNo);

            // Scroll to Form section
            $('html, body').animate({
                scrollTop: $("#add-student").offset().top - 80
            }, 300);
        }
    });

    // Delete button click event using jQuery $ (Triggers Modal)
    $("#studentTableBody").on("click", ".btn-delete-click", function () {
        rollToDelete = $(this).data("roll");
        let name = $(this).data("name");

        $("#modalStudentName").text(name);
        $("#modalStudentRoll").text(rollToDelete);

        // Show Bootstrap Modal
        let myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        myModal.show();
    });

    // Modal delete confirmation button click event using jQuery $
    $("#confirmDeleteBtn").on("click", () => {
        if (rollToDelete) {
            deleteStudent(rollToDelete);
            rollToDelete = null;
            
            // Hide Modal
            let modalEl = document.getElementById('deleteModal');
            let modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        }
    });

    // Live Search Box (KeyUp event using jQuery $)
    $("#searchStudent").on("keyup", function () {
        let query = $(this).val().toLowerCase();
        
        let filtered = studentsList.filter(s => {
            return s.name.toLowerCase().includes(query) || 
                   s.rollNo.toString().includes(query) || 
                   s.department.toLowerCase().includes(query);
        });

        renderStudentTable(filtered);
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