// dummyTodos.js — temporary stand-in for the fetch effect

export const dummyTodayTodos = [
  {
    _id: "t1",
    title: "Finish React todo app UI",
    dueDate: new Date(),
    priority: "high",
    todoCategory: "Work",
    isCompleted: false,
    isExpaired: false,
  },
  {
    _id: "t2",
    title: "Reply to client email",
    dueDate: new Date(),
    priority: "medium",
    todoCategory: "Work",
    isCompleted: false,
    isExpaired: false,
  },
]

export const dummyUpcomingTodos = [
  {
    _id: "t3",
    title: "Plan weekend trip",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: "low",
    todoCategory: "Personal",
    isCompleted: false,
    isExpaired: false,
  },
  {
    _id: "t4",
    title: "Prepare presentation slides",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: "high",
    todoCategory: "Work",
    isCompleted: false,
    isExpaired: false,
  },
]

export const dummyCompletedTodos = [
  {
    _id: "t5",
    title: "Buy groceries",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: "low",
    todoCategory: "Personal",
    isCompleted: true,
    isExpaired: false,
  },
  {
    _id: "t6",
    title: "Push code to GitHub",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: "medium",
    todoCategory: "Work",
    isCompleted: true,
    isExpaired: false,
  },
]

export const dummyExpiredTodos = [
  {
    _id: "t7",
    title: "Renew gym membership",
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    priority: "medium",
    todoCategory: "Personal",
    isCompleted: false,
    isExpaired: true,
  },
  {
    _id: "t8",
    title: "Submit tax documents",
    dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    priority: "high",
    todoCategory: "Work",
    isCompleted: false,
    isExpaired: true,
  },
]