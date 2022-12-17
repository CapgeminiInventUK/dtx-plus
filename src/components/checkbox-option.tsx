import React from "react";

function CheckboxOption({ inputId, label, checked, onChange }: CheckboxOptionProp) {
  return (
    <div>
      <div>
        <label htmlFor={inputId}>
          {label}
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}

interface CheckboxOptionProp {
  inputId: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default CheckboxOption;
