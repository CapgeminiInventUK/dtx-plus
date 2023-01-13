import React from "react";
import { FormControlLabel } from "@mui/material";
import Android12Switch from "./android-12-switch";

function SwitchOption({ inputId, label, checked, onChange }: SwitchOptionProp) {
  return (
    <FormControlLabel
      label={label}
      control={
        <Android12Switch
          id={inputId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
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
