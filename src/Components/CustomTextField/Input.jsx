import React from 'react'
import './CustomTextField.css'

function CustomTextField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}) {
  return (
    <div className='input-field'>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default CustomTextField
