import React from "react";
import { TextField } from "@mui/material";

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
    <TextField
      id={inputId}
      label={label}
      type={inputType}
      value={value}
      variant="outlined"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default InputOption;
