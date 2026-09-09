import api from "./api";

//* SECTION 01 - TIMETABLE

// update
export const saveTimetable = (clses) => api.put("/activites/attendance/update-timetable", { clses })

// fatch data
export const getClasses = () => api.get("/activites/attendance/classes-data")
export const getSubjects = () => api.get("/activites/attendance/subjects-data")


// * SECTION 02 - TODAY CLASSES
export const getTodayClasses = () => api.get("/activites/attendance/attendance-data")
export const updateAttendance = (subjectId, attended) =>
  api.post("/activites/attendance/update-attendace", { subjectId, attended })

// * SECTION 03 - ANALYTHICS

// * SECTION 04 - GRID DATA
export const getMonthlyGrid = (month, year) => api.get("/activites/attendance/monthly-grid", { params: { month, year } })