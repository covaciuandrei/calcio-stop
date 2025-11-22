import React from 'react';

interface DateInputProps {
  id?: string;
  value: string; // ISO format (YYYY-MM-DD) for internal use
  onChange: (value: string) => void; // Returns ISO format (YYYY-MM-DD)
  min?: string; // ISO format (YYYY-MM-DD)
  max?: string; // ISO format (YYYY-MM-DD)
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * DateInput component using native HTML5 date picker
 */
const DateInput: React.FC<DateInputProps> = ({ id, value, onChange, min, max, placeholder, className, disabled }) => {
  return (
    <input
      type="date"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};

export default DateInput;
