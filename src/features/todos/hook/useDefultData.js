import { Temporal } from 'temporal-polyfill'

// * STATC DATA
export const priorityOptions = ["low", "medium", "high"]
export const todoCategoryOptions = ['Personal', 'Work']
export const todoPages = ["all", "today", "upcoming", "completed", "expired"]

const today = Temporal.Now.plainDateISO()
export const dueDateOptions = [
  { label: 'Today', date: today },
  { label: 'Tomorrow', date: today.add({ days: 1 }) },
  { label: 'Next Week', date: today.add({ days: 7 }) },
]

// * DATE HELPERS
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: 'numeric',
  month: 'short'
})

// For display in the UI
export const formatDate = (plainDate) =>
  dateFormatter.format(new Date(plainDate.year, plainDate.month - 1, plainDate.day))

// For save in DB
export const toJSDate = (plainDate) =>
  new Date(plainDate.year, plainDate.month - 1, plainDate.day)