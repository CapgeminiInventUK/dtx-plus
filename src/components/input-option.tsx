import React from "react";

type InputType = "text" | "number";

type InputOptionProps = {
  inputId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputType: InputType;
};

function InputOption({ inputId, label, value, onChange, inputType }: InputOptionProps) {
  return (
    <div>
      <div>
        <label htmlFor={inputId}>
          {label}
          <input
            id={inputId}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

export default InputOption;
