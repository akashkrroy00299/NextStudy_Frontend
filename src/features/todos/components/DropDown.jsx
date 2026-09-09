import React from 'react'

const DropDown = ({ options, setFunction }) => {
  return (
    <div className='drop_down_section'>
      {options.map((el, i) => (
        <div
          className='dorp_down_element'
          key={el?.label ?? el ?? i}
          onClick={() => setFunction(el?.date ?? el)}
        >
          {el?.label ?? el}
        </div>
      ))}
    </div>
  )
}

export default DropDown