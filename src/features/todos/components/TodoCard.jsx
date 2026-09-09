import React, { useState } from 'react'
import { Check } from 'reicon-react';
import { deleteTodo, updateTodoStatus } from "../todoApi.js"
import useDebouncedCallback from '../hook/useDebouncedCallback.js';
import { useTodoContext } from '../../../context/TodoContext.jsx';
import EditTodo from './EditTodo.jsx';
import "./TodoCard.css"

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

const hexToRgbString = (hex, alpha = 1) => {
  const { r, g, b } = hexToRgb(hex)
  return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const priorityColors = { low: "#e0ffc2", medium: "#014bba", high: "#dd0426" }

const dueDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: 'numeric',
  month: 'short'
})

const formatDueDate = (dueDate) => dueDateFormatter.format(new Date(dueDate))


//* START
const TodoCard = ({ todo }) => {
  const { triggerReload } = useTodoContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isChack, seIsChack] = useState(todo.isCompleted)

  const debouncedToggle = useDebouncedCallback(async (finalValue) => {
    try {
      await updateTodoStatus(todo._id, finalValue)
      triggerReload()
    } catch (err) {
      console.error('toggle failed:', err)
      seIsChack(!finalValue)
    }
  }, 600)

  const handleToggle = () => {
    const next = !isChack
    seIsChack(next)
    debouncedToggle(next)
  }

  const hendleEditOn = () => setIsEditing(true)
  const handleDelete = async () => {
    try {
      await deleteTodo(todo._id)
      triggerReload()
    } catch (err) {
      console.error('delete failed:', err)
    }
  }

  return (
    <div className={`todo_card ${isChack ? 'todo_card_completed' : ''}`}>
      <div className="todos_chakbox">
        <input type="checkbox" checked={isChack} onChange={handleToggle} />
        <Check size={14} className="chakbox_icon" />
      </div>
      <div>
        <div className={`titel ${isChack ? 'titel_completed' : ''}`}>{todo.title}</div>
        <div className="todo_info">
          <div className={`dueDate ${todo.isExpaired && !isChack ? 'dueDate_expaired' : ''}`}>
            <span>due</span>
            <span>{formatDueDate(todo.dueDate)}</span>
          </div>
          <div
            className='priority'
            style={{
              color: hexToRgbString(priorityColors[todo.priority]),
              background: hexToRgbString(priorityColors[todo.priority], 0.3),
            }}
          >
            {todo.priority}
          </div>
          <div className='todo_category'>{todo.category}</div>
        </div>
      </div>

      <div>
        <div className="edit_btn_todo">
          <button onClick={hendleEditOn}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {isEditing && <EditTodo todo={todo} setIsEditing={setIsEditing} />}
    </div>
  )
}

export default TodoCard