import { Temporal } from "temporal-polyfill"

export const WEEK_DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const DAY_INDEX_BY_NAME = Object.freeze({
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
})

export const normalizeDayIndex = (value) => {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 6) {
    return value
  }

  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase()

    if (/^\d$/.test(trimmed)) {
      const numericValue = Number(trimmed)
      if (numericValue >= 0 && numericValue <= 6) return numericValue
    }

    const directMatch = DAY_INDEX_BY_NAME[trimmed]
    if (directMatch !== undefined) return directMatch

    const shortName = trimmed.slice(0, 3)
    const shortMatch = DAY_INDEX_BY_NAME[shortName]
    if (shortMatch !== undefined) return shortMatch
  }

  return 0
}

export const getDayLabel = (value) => WEEK_DAY_NAMES[normalizeDayIndex(value)] ?? "Mon"

export const getWeekDays = (weekNames = WEEK_DAY_NAMES) => {
  const today = Temporal.Now.plainDateISO()
  const monday = today.subtract({ days: today.dayOfWeek - 1 })

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = monday.add({ days: index })

    return {
      label: weekNames[index],
      dayIndex: index,
      date: date.day,
      month: date.month,
      isoDate: date.toString(),
    }
  })

  return { weekDays, today }
}