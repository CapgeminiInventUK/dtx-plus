import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

function SwitchOption({ inputId, label, checked, onChange }: SwitchOptionProp) {
  return (
    <FormControlLabel
      label={label}
      control={
        <Switch id={inputId} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      }
    />
  );
}

interface SwitchOptionProp {
  inputId: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default SwitchOption;
