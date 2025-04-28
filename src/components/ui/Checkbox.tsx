"use client"

import type React from "react"

interface CheckboxProps {
  id?: string
  name?: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Checkbox({ id, name, checked, onChange, label, disabled = false, className = "" }: CheckboxProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}
