import React, { useState, useRef } from 'react'
import { Temporal } from 'temporal-polyfill'
import { AngleDown, AngleUp } from 'reicon-react'
import DropDown from './DropDown.jsx'
import useClickOutside from '../../../hooks/js/useClickOutside.js'
import { updateTodo } from '../todoApi.js'
import { useTodoContext } from '../../../context/TodoContext.jsx'
import {
  priorityOptions,
  todoCategoryOptions,
  dueDateOptions,
  formatDate,
  toJSDate,
} from '../hook/useDefultData.js'
import "./EditTodo.css"

const EditTodo = ({ todo, setIsEditing }) => {
  const initialDueDate = (() => {
    const d = new Date(todo.dueDate)
    return Temporal.PlainDate.from({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    })
  })()

  const { triggerReload } = useTodoContext()

  const [todoData, setTodoData] = useState({
    title: todo.title,
    priority: todo.priority,
    category: todo.category,
    dueDate: initialDueDate,
  })

  const [openPriority, setOpenPriority] = useState(false)
  const [openDueDate, setOpenDueDate] = useState(false)
  const [openCategorys, setOpenCategorys] = useState(false)

  const overLayRef = useRef(null)
  const priorityRef = useRef(null)
  const dueDateRef = useRef(null)
  const categoryRef = useRef(null)

  useClickOutside(priorityRef, () => setOpenPriority(false))
  useClickOutside(dueDateRef, () => setOpenDueDate(false))
  useClickOutside(categoryRef, () => setOpenCategorys(false))

  const updateField = (field, value) => {
    setTodoData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!todoData.title.trim()) return

    try {
      await updateTodo(todo._id, {
        ...todoData,
        dueDate: toJSDate(todoData.dueDate),
      })
      triggerReload()
      setIsEditing(false)
    } catch (error) {
      console.log('ERROR AT UPDATE TODO!', error)
    }
  }

  return (
    <div className='edit_todo_overlay' onClick={handleCancel}>
      <div className='edit_todo_model' onClick={(e) => e.stopPropagation()} ref={overLayRef}>

        <input
          className='edit_title_input'
          type="text"
          value={todoData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder='Task title'
        />

        <div className='edit_todo_row'>
          <div className="edit_dropdown_wrap" ref={priorityRef}>
            <button className='edit_priority_btn' onClick={() => setOpenPriority(!openPriority)}>
              {todoData.priority}
              {openPriority ? <AngleDown size={14} /> : <AngleUp size={14} />}
            </button>
            {openPriority && (
              <DropDown
                options={priorityOptions}
                setFunction={(val) => { updateField('priority', val); setOpenPriority(false) }}
              />
            )}
          </div>

          <div className="edit_dropdown_wrap" ref={dueDateRef}>
            <button className='edit_duedate_btn' onClick={() => setOpenDueDate(!openDueDate)}>
              {formatDate(todoData.dueDate)}
              {openDueDate ? <AngleDown size={14} /> : <AngleUp size={14} />}
            </button>
            {openDueDate && (
              <DropDown
                options={dueDateOptions}
                setFunction={(val) => { updateField('dueDate', val); setOpenDueDate(false) }}
              />
            )}
          </div>

          <div className="edit_dropdown_wrap" ref={categoryRef}>
            <button className='edit_category_btn' onClick={() => setOpenCategorys(!openCategorys)}>
              {todoData.category}
              {openCategorys ? <AngleDown size={14} /> : <AngleUp size={14} />}
            </button>
            {openCategorys && (
              <DropDown
                options={todoCategoryOptions}
                setFunction={(val) => { updateField('category', val); setOpenCategorys(false) }}
              />
            )}
          </div>
        </div>

        <div className='edit_todo_actions'>
          <button className='edit_modal_cancel' onClick={handleCancel}>Cancel</button>
          <button className='edit_modal_save' onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default EditTodo