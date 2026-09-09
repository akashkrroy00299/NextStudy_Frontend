import React, { useEffect, useState, useRef } from 'react'
import { Temporal } from 'temporal-polyfill'
import { AngleDown, AngleUp } from 'reicon-react'
import { useUser } from '../../context/UserContext'
import ShowTodo from './components/ShowTodo'
import DropDown from './components/DropDown.jsx'
import useClickOutside from '../../hooks/js/useClickOutside.js'
import { getTodos, addTodo } from "./todoApi.js"
import { useTodoContext } from '../../context/TodoContext.jsx'
import {
  priorityOptions,
  todoCategoryOptions,
  todoPages,
  dueDateOptions,
  formatDate,
  toJSDate,
} from './hook/useDefultData.js'
import "./Todos.css"

const Todos = () => {
  const { user, settings, userLoading } = useUser()

  // -- User-derived data ------------------------------------------------
  const [todoCategorys, setTodoCategorys] = useState(null)
  const { reload, triggerReload } = useTodoContext()

  // -- Create-todo form state --------------------------------------------
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState(priorityOptions[1])
  const [dueDate, setDueDate] = useState(dueDateOptions[1].date)
  const [todoCategory, setTodoCategory] = useState(todoCategoryOptions[0])

  // -- Dropdown open/close state -------------------------------------------
  const [openPriority, setOpenPriority] = useState(false)
  const [openDueDate, setOpenDueDate] = useState(false)
  const [openCategorys, setOpenCategorys] = useState(false)

  // -- Refs for click-outside detection --------------------------------------------
  const priorityRef = useRef(null)
  const dueDateRef = useRef(null)
  const categoryRef = useRef(null)

  useClickOutside(priorityRef, () => setOpenPriority(false))
  useClickOutside(dueDateRef, () => setOpenDueDate(false))
  useClickOutside(categoryRef, () => setOpenCategorys(false))

  // -- Page / filter state --------------------------------------------
  const [page, setPage] = useState("all")

  // -- Fetched todo lists --------------------------------------------
  const [todayTodos, setTodayTodos] = useState([])
  const [upcomingTodos, setUpcomingTodos] = useState([])
  const [completedTodos, setCompletedTodos] = useState([])
  const [expiredTodos, setExpiredTodos] = useState([])

  // -- Effects --------------------------------------------
  useEffect(() => {
    if (!user) return
    const configuredCategories = settings?.todoCategory
      ?.map((category) => typeof category === "string" ? category : category?.name)
      .filter(Boolean)
    const categories = configuredCategories?.length ? configuredCategories : todoCategoryOptions
    setTodoCategorys(categories)
    setTodoCategory(categories[0])
  }, [user, settings, userLoading])

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await getTodos()
        console.log('todos response:', res.data)
        setTodayTodos(res.data.today)
        setUpcomingTodos(res.data.upcoming)
        setCompletedTodos(res.data.completed)
        setExpiredTodos(res.data.expired)
      } catch (err) {
        console.error('Failed to fetch todos:', err)
      }
    }

    fetchTodos()
  }, [reload])

  // -- Derived values --------------------------------------------
  const allTodos = [...todayTodos, ...upcomingTodos, ...completedTodos, ...expiredTodos]
  const showAllTodos = allTodos.length > 0

  const pageTodoMap = {
    all: allTodos,
    today: todayTodos,
    upcoming: upcomingTodos,
    completed: completedTodos,
    expired: expiredTodos,
  }

  // -- Handlers --------------------------------------------
  const handleAddTodo = async () => {
    if (title.trim().length < 1) return

    const payload = {
      title: title.trim(),
      priority,
      dueDate: toJSDate(dueDate),
      category: todoCategory,
    }

    try {
      await addTodo(payload)
      triggerReload()
      setTitle("")
    } catch (error) {
      console.log("Error to Add Todo", error.message)
    }
  }

  const sectionsByPage = {
    all: [
      { key: "today", label: "Today", todos: todayTodos },
      { key: "upcoming", label: "Upcoming", todos: upcomingTodos },
      { key: "completed", label: "Completed", todos: completedTodos },
    ],
    today: [{ key: "today", label: "Today", todos: todayTodos }],
    upcoming: [{ key: "upcoming", label: "Upcoming", todos: upcomingTodos }],
    expired: [{ key: "expired", label: "Expired", todos: expiredTodos }],
    completed: [{ key: "completed", label: "Completed", todos: completedTodos }],
  }

  return (
    <div className='todos_wrapper'>
      <div className="todos_analythics">
        Todos
        <p>What's on your plate today.</p>
      </div>

      <div className='new_todos'>
        <div className="todo_input_warapper">
          <div>
            <input
              type="text"
              placeholder='Add a new task'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button className='add' onClick={handleAddTodo}>Add</button>
          </div>
          <div>
            <div className="dropdown_wrap" ref={priorityRef}>
              <button className='add_priority' onClick={() => setOpenPriority(!openPriority)}>
                {priority}
                {openPriority ? <AngleDown size={14} /> : <AngleUp size={14} />}
              </button>
              {openPriority && <DropDown options={priorityOptions} setFunction={setPriority} />}
            </div>

            <div className="dropdown_wrap" ref={dueDateRef}>
              <button className='dueDate' onClick={() => setOpenDueDate(!openDueDate)}>
                {formatDate(dueDate)}
                {openDueDate ? <AngleDown size={14} /> : <AngleUp size={14} />}
              </button>
              {openDueDate && <DropDown options={dueDateOptions} setFunction={setDueDate} />}
            </div>

            <div className="dropdown_wrap" ref={categoryRef}>
              <button className='add_category' onClick={() => setOpenCategorys(!openCategorys)}>
                {todoCategory}
                {openCategorys ? <AngleDown size={14} /> : <AngleUp size={14} />}
              </button>
              {openCategorys && todoCategorys && <DropDown options={todoCategorys} setFunction={setTodoCategory} />}
            </div>
          </div>
        </div>
      </div>

      <div className="todos">
        <div>
          <div className="todos_options_show">
            {todoPages.map((op) => (
              <div key={op} className={op === page ? "active_show_option" : ""} onClick={() => setPage(op)}>{op}</div>
            ))}
          </div>
          <button onClick={triggerReload}>Refrash</button>
        </div>
        <div className="todos_shoing">
          <ShowTodo sections={sectionsByPage[page] ?? []} />
        </div>
      </div>
    </div>
  )
}

export default Todos