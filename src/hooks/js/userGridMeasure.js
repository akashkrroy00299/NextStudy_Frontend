import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const useGridMeasure = (deps = []) => {
    const tableRef = useRef(null)
    const [grid, setGrid] = useState({
        labelWidth: 0,
        headerHeight: 0,
        cellWidth: 0,
        cellHeight: 0
    })

    const measure = useCallback(() => {
        const table = tableRef.current
        if(!table) return

        const dayCell = table.querySelector(".day-cell")
        const hourCell = table.querySelector(".hour-cell")
        if(!dayCell || !hourCell) return

        const dayRect = dayCell.getBoundingClientRect()
        const hourRect = hourCell.getBoundingClientRect()

        setGrid({
            labelWidth: dayRect.width,
            headerHeight: hourRect.height,
            cellWidth: hourRect.width,
            cellHeight: dayRect.height,
        })
    }, [])

    useLayoutEffect(() => {
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [measure, ...deps])

    return { tableRef, grid }
}