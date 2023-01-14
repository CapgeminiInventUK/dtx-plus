document.querySelectorAll<HTMLDivElement>("#Div1 > div.FormView > div.Left").forEach((elem) => {
  elem.className = "Left2";
  elem.style.marginLeft = "2em";
});

document.querySelectorAll<HTMLDivElement>("#expenseEntryDiv > div.Left").forEach((elem) => {
  elem.style.marginLeft = "2em";
});

if (document.getElementById("Label2")) {
  const elm = document.getElementById("Label2");
  elm!.className = "Title";
  elm!.textContent = "Type";
}
if (document.getElementById("Label8")) {
  document.getElementById("Label8")!.remove();
}

if (document.getElementById("lblTime")) {
  const elm = document.getElementById("lblTime");
  elm!.className = "Control_Label Control_Label_Margins";
  elm!.style.paddingTop = "1px";
}

if (document.getElementById("lblExpenses")) {
  const elm = document.getElementById("lblExpenses");
  elm!.style.paddingTop = "1px";
}

if (document.getElementById("lblOther")) {
  const elm = document.getElementById("lblOther");
  elm!.style.paddingTop = "1px";
}

if (document.getElementById("Label5")) {
  const elm = document.getElementById("Label5");
  elm!.style.width = "auto";
}
