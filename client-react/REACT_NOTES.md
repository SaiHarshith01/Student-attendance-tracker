# React Quick Revision Notes (Unit III Viva Guide)

### 1. Actual DOM vs Virtual DOM
* **Actual DOM:** The browser's native tree representation of HTML elements. Directly updating it is slow and triggers expensive browser reflows and repaints.
* **Virtual DOM:** A lightweight in-memory JavaScript copy of the actual DOM maintained by React. When state changes, React updates the Virtual DOM, calculates the minimal diff (reconciliation), and updates only the changed elements in the real DOM.

### 2. State vs Props
* **Props (Properties):** Read-only data passed from parent component to child component (unidirectional data flow). A child cannot modify its own props. Example: `<Dashboard students={students} />`.
* **State:** Mutable, internal data owned and managed by a component using `useState`. When state changes, React automatically re-renders the component to reflect new data.

### 3. Where Each Hook is Used in Our Project
* **`useState`:**
  * `App.jsx`: Manages `students`, `loading`, and `error` states.
  * `StudentForm.jsx`: Manages controlled form inputs (`formData`), `error`, and `success`.
  * `StudentTable.jsx`: Manages `studentToDelete` modal state.
  * `AttendanceForm.jsx`: Manages `rollNo`, `date`, `status`, and `logs`.
* **`useEffect`:**
  * `App.jsx`: Fetches all student records from Express backend on initial component mount (`[]`).
  * `AttendanceForm.jsx`: Re-fetches attendance history whenever `filterDate` changes (`[filterDate]`).
  * `Reports.jsx`: Fetches low-attendance students when entering the `/reports` route.
* **`useNavigate` & `useSearchParams` (React Router):**
  * `StudentTable.jsx` uses `useNavigate` to switch to `/attendance?rollNo=...`.
  * `AttendanceForm.jsx` uses `useSearchParams` to pre-populate the student dropdown from the URL.
