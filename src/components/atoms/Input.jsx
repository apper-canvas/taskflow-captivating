import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input