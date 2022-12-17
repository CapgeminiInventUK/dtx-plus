import React from "react";

type DropDownOptionItemProps = {
  value: string;
  label: string;
};

type DropdownOptionProps = {
  inputId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropDownOptionItemProps[];
};

function DropdownOption({ inputId, value, label, onChange, options }: DropdownOptionProps) {
  return (
    <div>
      <label htmlFor={inputId}>
        {label}
        <select id={inputId} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default DropdownOption;
