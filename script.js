/* =====================================
   Student Management Dashboard
   CRUD + localStorage + Search + Filter
===================================== */


/* =====================================
   Get HTML Elements
===================================== */

const studentForm = document.getElementById("studentForm");

const studentId = document.getElementById("studentId");
const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const department = document.getElementById("department");
const year = document.getElementById("year");
const gender = document.getElementById("gender");

const editIndex = document.getElementById("editIndex");

const studentTableBody =
    document.getElementById("studentTableBody");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const filterDepartment =
    document.getElementById("filterDepartment");

const filterYear =
    document.getElementById("filterYear");

const submitBtn =
    document.getElementById("submitBtn");

const formTitle =
    document.getElementById("formTitle");


/* =====================================
   Get Students From localStorage
===================================== */

let students =
    JSON.parse(localStorage.getItem("students")) || [];


/* =====================================
   Save Students to localStorage
===================================== */

function saveToLocalStorage() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


/* =====================================
   Add / Update Student
===================================== */

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const student = {

        id: studentId.value.trim(),

        name: studentName.value.trim(),

        email: email.value.trim(),

        department: department.value,

        year: year.value,

        gender: gender.value

    };


    /* Check for duplicate Student ID */

    const duplicate = students.some((item, index) => {

        return item.id.toLowerCase() === student.id.toLowerCase()
            && index !== Number(editIndex.value);

    });


    if (duplicate) {

        alert("Student ID already exists!");

        return;
    }


    /* If editing */

    if (editIndex.value !== "") {

        const index = Number(editIndex.value);

        students[index] = student;

        alert("Student details updated successfully!");

    }

    /* If adding */

    else {

        students.push(student);

        alert("Student added successfully!");

    }


    saveToLocalStorage();

    studentForm.reset();

    editIndex.value = "";

    formTitle.textContent = "Add Student";

    submitBtn.textContent = "➕ Add Student";

    document.getElementById("cancelBtn").style.display = "none";

    displayStudents();

});


/* =====================================
   Display Students
===================================== */

function displayStudents() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedDepartment =
        filterDepartment.value;

    const selectedYear =
        filterYear.value;


    /* Clear table */

    studentTableBody.innerHTML = "";


    /* Filter students */

    const filteredStudents = students.filter(function(student) {

        const matchesSearch =

            student.id.toLowerCase().includes(searchText) ||

            student.name.toLowerCase().includes(searchText) ||

            student.email.toLowerCase().includes(searchText) ||

            student.department.toLowerCase().includes(searchText);


        const matchesDepartment =

            selectedDepartment === "All" ||

            student.department === selectedDepartment;


        const matchesYear =

            selectedYear === "All" ||

            student.year === selectedYear;


        return (
            matchesSearch &&
            matchesDepartment &&
            matchesYear
        );

    });


    /* Show empty message */

    if (filteredStudents.length === 0) {

        emptyMessage.style.display = "block";

    }

    else {

        emptyMessage.style.display = "none";

    }


    /* Create table rows */

    filteredStudents.forEach(function(student) {

        const originalIndex =
            students.indexOf(student);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${originalIndex + 1}</td>

            <td>
                <strong>${student.id}</strong>
            </td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>
                <span class="department-badge">
                    ${student.department}
                </span>
            </td>

            <td>${student.year}</td>

            <td>${student.gender}</td>

            <td>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editStudent(${originalIndex})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${originalIndex})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </td>
        `;


        studentTableBody.appendChild(row);

    });


    updateStatistics();

}


/* =====================================
   Edit Student
===================================== */

function editStudent(index) {

    const student = students[index];


    studentId.value =
        student.id;

    studentName.value =
        student.name;

    email.value =
        student.email;

    department.value =
        student.department;

    year.value =
        student.year;

    gender.value =
        student.gender;


    editIndex.value = index;


    formTitle.textContent =
        "Edit Student";


    submitBtn.textContent =
        "💾 Update Student";


    document.getElementById("cancelBtn").style.display =
        "inline-block";


    /* Scroll to form */

    document.querySelector(".form-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================
   Cancel Edit
===================================== */

function cancelEdit() {

    studentForm.reset();

    editIndex.value = "";

    formTitle.textContent =
        "Add Student";

    submitBtn.textContent =
        "➕ Add Student";

    document.getElementById("cancelBtn").style.display =
        "none";
}


/* =====================================
   Delete Student
===================================== */

function deleteStudent(index) {

    const studentName =
        students[index].name;


    const confirmation =
        confirm(
            `Are you sure you want to delete ${studentName}?`
        );


    if (confirmation) {

        students.splice(index, 1);

        saveToLocalStorage();

        displayStudents();

        alert("Student deleted successfully!");

    }

}


/* =====================================
   Search
===================================== */

searchInput.addEventListener(
    "input",
    displayStudents
);


/* =====================================
   Department Filter
===================================== */

filterDepartment.addEventListener(
    "change",
    displayStudents
);


/* =====================================
   Year Filter
===================================== */

filterYear.addEventListener(
    "change",
    displayStudents
);


/* =====================================
   Update Dashboard Statistics
===================================== */

function updateStatistics() {

    document.getElementById("totalStudents")
        .textContent = students.length;


    const cseCount =
        students.filter(
            student => student.department === "CSE"
        ).length;


    const eceCount =
        students.filter(
            student => student.department === "ECE"
        ).length;


    const eeeCount =
        students.filter(
            student => student.department === "EEE"
        ).length;


    document.getElementById("cseStudents")
        .textContent = cseCount;


    document.getElementById("eceStudents")
        .textContent = eceCount;


    document.getElementById("eeeStudents")
        .textContent = eeeCount;

}


/* =====================================
   Initial Display
===================================== */

displayStudents();


/* =====================================
   Hide Cancel Button Initially
===================================== */

document.getElementById("cancelBtn").style.display =
    "none";
