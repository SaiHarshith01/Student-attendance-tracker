// Student data

let students = [

    {
        name: "Rahul Kumar",
        rollNo: 101,
        email: "rahul@gmail.com",
        department: "CSE",
        gender: "Male",
        date: "2026-08-24",
        present: 18,
        absent: 2
    },

    {
        name: "Priya Sharma",
        rollNo: 102,
        email: "priya@gmail.com",
        department: "CSE",
        gender: "Female",
        date: "2026-08-24",
        present: 16,
        absent: 4
    }

];


// Calculate attendance

const calculateAttendance = (present, absent) => {

    let total = present + absent;

    if (total === 0) {

        return 0;

    }

    return Math.round(
        (present / total) * 100
    );

};


// Display students

const displayStudents = () => {

    $("#studentTable").html("");

    let totalAttendance = 0;


    students.forEach(student => {

        let attendance =
            calculateAttendance(
                student.present,
                student.absent
            );


        totalAttendance += attendance;


        $("#studentTable").append(`

            <tr>

                <td>${student.rollNo}</td>

                <td>${student.name}</td>

                <td>${student.department}</td>

                <td class="text-success">
                    ${student.present}
                </td>

                <td class="text-danger">
                    ${student.absent}
                </td>

                <td>
                    ${attendance}%
                </td>

                <td>

                    <button
                        class="btn btn-success btn-sm presentBtn"
                        data-roll="${student.rollNo}">

                        Present

                    </button>


                    <button
                        class="btn btn-danger btn-sm absentBtn"
                        data-roll="${student.rollNo}">

                        Absent

                    </button>


                    <button
                        class="btn btn-secondary btn-sm deleteBtn"
                        data-roll="${student.rollNo}">

                        Delete

                    </button>

                </td>

            </tr>

        `);

    });


    // Total students

    $("#totalStudents").text(
        students.length
    );


    // Average attendance

    let average = 0;

    if (students.length > 0) {

        average =
            Math.round(
                totalAttendance / students.length
            );

    }


    $("#averageAttendance").text(
        average + "%"
    );

};


// Validate form

const validateForm = (
    name,
    rollNo,
    email,
    department,
    gender
) => {


    // Name Regular Expression

    let nameRegex =
        /^[a-zA-Z ]+$/;


    if (!nameRegex.test(name)) {

        showAlert(
            "Please enter a valid name."
        );

        return false;

    }


    // Email Regular Expression

    let emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

        showAlert(
            "Please enter a valid email."
        );

        return false;

    }


    // Department

    if (department === "") {

        showAlert(
            "Please select a department."
        );

        return false;

    }


    // Gender

    if (gender === "") {

        showAlert(
            "Please select gender."
        );

        return false;

    }


    // Roll number

    if (
        isNaN(rollNo) ||
        Number(rollNo) <= 0
    ) {

        showAlert(
            "Please enter a valid roll number."
        );

        return false;

    }


    return true;

};


// Show Bootstrap alert

const showAlert = (message) => {

    $("#alertBox").html(`

        <div class="alert alert-danger">

            ${message}

        </div>

    `);

};


// Page loaded

$(document).ready(() => {


    // Display existing students

    displayStudents();


    // Form submit event

    $("#studentForm").on(
        "submit",
        (event) => {


            // Prevent normal POST page reload

            event.preventDefault();


            // Get form values

            let name =
                $("#studentName").val().trim();


            let rollNo =
                $("#rollNo").val().trim();


            let email =
                $("#email").val().trim();


            let department =
                $("#department").val();


            let gender =
                $("input[name='gender']:checked").val()
                || "";


            let date =
                $("#date").val();


            // Validate

            if (
                !validateForm(
                    name,
                    rollNo,
                    email,
                    department,
                    gender
                )
            ) {

                return;

            }


            // Type conversion

            let rollNumber =
                parseInt(rollNo);


            // Check duplicate roll number

            let exists =
                students.some(
                    student =>
                        student.rollNo === rollNumber
                );


            if (exists) {

                showAlert(
                    "Roll number already exists."
                );

                return;

            }


            // Add student

            students.push({

                name: name,

                rollNo: rollNumber,

                email: email,

                department: department,

                gender: gender,

                date: date,

                present: 0,

                absent: 0

            });


            // Success message

            $("#alertBox").html(`

                <div class="alert alert-success">

                    Student added successfully!

                </div>

            `);


            // Reset form

            $("#studentForm")[0].reset();


            // Display updated table

            displayStudents();

        }
    );


    // Present button

    $(document).on(
        "click",
        ".presentBtn",
        (event) => {


            let roll =
                parseInt(
                    $(event.currentTarget)
                    .data("roll")
                );


            let student =
                students.find(
                    student =>
                        student.rollNo === roll
                );


            if (!student) {

                return;

            }


            student.present++;


            displayStudents();

        }
    );


    // Absent button

    $(document).on(
        "click",
        ".absentBtn",
        (event) => {


            let roll =
                parseInt(
                    $(event.currentTarget)
                    .data("roll")
                );


            let student =
                students.find(
                    student =>
                        student.rollNo === roll
                );


            if (!student) {

                return;

            }


            student.absent++;


            displayStudents();

        }
    );


    // Delete button

    $(document).on(
        "click",
        ".deleteBtn",
        (event) => {


            let roll =
                parseInt(
                    $(event.currentTarget)
                    .data("roll")
                );


            students =
                students.filter(
                    student =>
                        student.rollNo !== roll
                );


            displayStudents();

        }
    );

});