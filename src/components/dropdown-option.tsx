import React from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";

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
      <InputLabel htmlFor={`${inputId}-label`}>{label}</InputLabel>

      <Select
        labelId={`${inputId}-label`}
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default DropdownOption;
