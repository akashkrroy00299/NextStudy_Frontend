import React, { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Draggable } from "gsap/Draggable"
import { formatTime } from "../utils/js/timeHelpers.js"

gsap.registerPlugin(useGSAP, Draggable)

const ClassBlock = ({ cls, left, top, width, height, tableRef, grid, setClasses, startHoure, weekNames, isEditing, isSaving, isModalOpen, openEditModal }) => {
  // * REFs
  const blockReft = useRef(null)
  const rightHandleRef = useRef(null)
  const leftHendleRef = useRef(null)

  const liveWidthRef = useRef(width)
  const clsRef = useRef(cls)
  const dragBaseWidthRef = useRef(width)
  const dragStartPointerXRef = useRef(0)
  const didDragRef = useRef(false)
  const dragStartPointRef = useRef({ x: 0, y: 0 })

  // * IN ANIMATION && H,W CALCULATION 
  useEffect(() => {
    liveWidthRef.current = width
    clsRef.current = cls
  }, [width, cls])

  useGSAP(() => {
    gsap.fromTo(
      blockReft.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    )
  }, { scope: blockReft })

  // * DRAG ANIMATION
  useGSAP(() => {
    const leftover = Draggable.get(blockReft.current)
    if (leftover) leftover.kill()

    if (isModalOpen || isSaving || !isEditing || !grid?.cellHeight || !grid?.cellWidth || !tableRef?.current) return

    const pxPerMinute = grid.cellWidth / 60
    const table = tableRef.current

    const draggables = Draggable.create(blockReft.current, {
      type: "x,y",
      onPress: function (e) {
        e.stopPropagation()
        didDragRef.current = false
        dragStartPointRef.current = { x: e.clientX, y: e.clientY }
      },
      onDrag: function (e) {
        const movedX = Math.abs(e.clientX - dragStartPointRef.current.x)
        const movedY = Math.abs(e.clientY - dragStartPointRef.current.y)

        if (movedX > 5 || movedY > 5) {
          didDragRef.current = true
        }
      },
      onClick: function () {
        if (didDragRef.current || isSaving) {
          didDragRef.current = false
          return
        }

        if (openEditModal) openEditModal(clsRef.current)
      },

      bounds: {
        top: grid.headerHeight,
        left: grid.labelWidth,
        width: table.clientWidth - grid.labelWidth,
        height: table.clientHeight - grid.headerHeight,
      },
      liveSnap: {
        x: (x) => Math.round(x / pxPerMinute) * pxPerMinute,
        y: (y) => Math.round(y / grid.cellHeight) * grid.cellHeight,
      },
      onDragEnd: function () {
        const blockRect = this.target.getBoundingClientRect()
        const tableRect = table.getBoundingClientRect()

        const finalLeft = blockRect.left - tableRect.left
        const finalTop = blockRect.top - tableRect.top

        const minuteOffset = Math.round((finalLeft - grid.labelWidth) / pxPerMinute)
        const newStart = startHoure * 60 + minuteOffset
        const duration = clsRef.current.end - clsRef.current.start

        const dayIndex = Math.round((finalTop - grid.headerHeight) / grid.cellHeight)

        gsap.set(this.target, { x: 0, y: 0 })

        setClasses((prev) =>
          prev.map((c) =>
            c._id === clsRef.current._id
              ? { ...c, start: newStart, end: newStart + duration, day: dayIndex }
              : c
          )
        )
      }
    })

    return () => {
      draggables.forEach((item) => item.kill())
    }
  }, { scope: blockReft, dependencies: [isEditing, isSaving, isModalOpen, grid?.cellHeight, grid?.cellWidth, grid?.headerHeight, grid?.labelWidth, tableRef, openEditModal] })

  // * LEFT DARG TO DURATION ANIMATION
  useGSAP(() => {
    const leftover = Draggable.get(rightHandleRef.current)
    if (leftover) leftover.kill()

    if (isModalOpen || isSaving || !isEditing || !grid?.cellWidth || !blockReft.current || !rightHandleRef.current) return

    const pxPerMinute = grid.cellWidth / 60
    const minWidth = pxPerMinute * 15

    const draggables = Draggable.create(rightHandleRef.current, {
      type: "x",
      onPress: function (e) {
        e.stopPropagation()
        didDragRef.current = false
        dragStartPointerXRef.current = e.clientX
        dragBaseWidthRef.current = liveWidthRef.current
      },
      onDrag: function (e) {
        const deltaX = e.clientX - dragStartPointerXRef.current
        if (Math.abs(deltaX) > 5) didDragRef.current = true

        const newWidth = Math.max(minWidth, dragBaseWidthRef.current + deltaX)

        gsap.set(blockReft.current, { width: newWidth })
        gsap.set(this.target, { x: 0 })
        liveWidthRef.current = newWidth
      },
      onDragEnd: function (e) {
        const deltaX = e.clientX - dragStartPointerXRef.current
        const finalWidth = Math.max(minWidth, dragBaseWidthRef.current + deltaX)
        const minuteDelta = Math.round(finalWidth / pxPerMinute)
        const newEnd = clsRef.current.start + minuteDelta

        gsap.set(this.target, { x: 0 })
        gsap.set(blockReft.current, { width: finalWidth })
        liveWidthRef.current = finalWidth

        setClasses((prev) =>
          prev.map((c) => (c._id === clsRef.current._id ? { ...c, end: newEnd } : c))
        )
      },
    })

    return () => {
      draggables.forEach((item) => item.kill())
    }
  }, { scope: blockReft, dependencies: [isEditing, isSaving, isModalOpen, grid?.cellWidth, cls._id] })

  // * RIGTH DRAG TO DURATION
  useGSAP(() => {
    const leftover = Draggable.get(leftHendleRef.current)
    if (leftover) leftover.kill()

    if (isModalOpen || isSaving || !isEditing || !grid?.cellWidth || !blockReft.current || !leftHendleRef.current) return

    const pxPerMinute = grid.cellWidth / 60
    const minWidth = pxPerMinute * 15

    const draggables = Draggable.create(leftHendleRef.current, {
      type: "x",
      onPress: function (e) {
        e.stopPropagation()
        didDragRef.current = false
        dragBaseWidthRef.current = liveWidthRef.current
        dragStartPointerXRef.current = e.clientX
      },
      onDrag: function (e) {
        const deltaX = e.clientX - dragStartPointerXRef.current
        if (Math.abs(deltaX) > 5) didDragRef.current = true

        const newWidth = Math.max(minWidth, dragBaseWidthRef.current - deltaX)
        const deltaBlockX = dragBaseWidthRef.current - newWidth

        gsap.set(blockReft.current, { width: newWidth, x: deltaBlockX })
        gsap.set(this.target, { x: 0 })
        liveWidthRef.current = newWidth
      },
      onDragEnd: function (e) {
        const deltaX = e.clientX - dragStartPointerXRef.current
        const finalWidth = Math.max(minWidth, dragBaseWidthRef.current - deltaX)
        const minuteDelta = Math.round((dragBaseWidthRef.current - finalWidth) / pxPerMinute)
        const newStart = clsRef.current.start + minuteDelta

        gsap.set(this.target, { x: 0 })
        gsap.set(blockReft.current, { width: finalWidth, x: 0 })
        liveWidthRef.current = finalWidth

        setClasses((prev) =>
          prev.map((c) => (c._id === clsRef.current._id ? { ...c, start: newStart } : c))
        )
      },
    })

    return () => {
      draggables.forEach((item) => item.kill())
    }
  }, { scope: blockReft, dependencies: [isEditing, isSaving, isModalOpen, grid?.cellWidth, cls._id] })

  // * HTML
  return (
    <div
      ref={blockReft}
      className="class-block"
      style={{
        left,
        top,
        width,
        height,
        "--event-color": cls.color,
        pointerEvents: isModalOpen ? "none" : "auto",
        opacity: isModalOpen ? 0 : 1,
      }}
    >
      <div className="resize-handle resize-handle-left" ref={leftHendleRef} />
      <div className="event-title-row">
        <span className="event-title">{cls.title}</span>
      </div>
      <div className="event-time">{formatTime(cls.start)}-{formatTime(cls.end)}</div>
      <div className="resize-handle resize-handle-right" ref={rightHandleRef} />
    </div>
  )
}

export default ClassBlock