// Uses user's selectHours setting to highlight full days in period overview calendar in green
chrome.storage.sync.get(
  {
    selectHours: 7.5,
  },
  (items) => {
    const dayFields = [
      ...document.querySelectorAll<HTMLInputElement>("#calDates_tabCalendar > tbody input"),
    ];

    dayFields.forEach((dayField) => {
      const intVal = parseFloat(dayField.value) || 0; // If field has no value use 0
      if (intVal === items.selectHours) dayField.style.background = "#0e68";
    });
  },
);
