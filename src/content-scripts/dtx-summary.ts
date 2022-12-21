import printLine from "./modules/print";
import { getSettings } from "./modules/settings";

// Corrects summary table column widths on Chrome
function fixColumnWidths() {
  // Assemble array of correct widths for each column
  // These are declared in the page but ignored by modern browsers
  const tableColumnWidths = [] as string[];
  const tableWidthElems = document.querySelectorAll<HTMLTableColElement>(
    "#G_uwgItems colgroup col",
  );
  tableWidthElems.forEach((elem) => {
    tableColumnWidths.push(elem.width);
  });

  // Remove bugged colgroups width setter
  // document.querySelector("#G_uwgItems colgroup").remove();

  // Correct header cell widths
  const tableHeaderCells = document.querySelectorAll<HTMLElement>(
    "#uwgItems_hdiv table thead tr th",
  );
  let headerCellIndex = 0;
  tableHeaderCells.forEach((th) => {
    if (th.style.display === "none") return;
    th.style.minWidth = tableColumnWidths[headerCellIndex];
    th.style.maxWidth = tableColumnWidths[headerCellIndex];
    th.removeAttribute("width");
    headerCellIndex += 1;
  });

  // Correct body cell widths for each row
  const tableRows = Array.from(document.querySelectorAll(".dtxMainData tr"));
  tableRows.forEach((row) => {
    const cells = row.querySelectorAll("td");

    let cellIndex = 0;
    cells.forEach((cell) => {
      if (cell.style.display === "none") return;

      if (cell.classList.contains("aiHdr")) {
        cell.style.display = "none";
        return;
      }

      cell.style.minWidth = tableColumnWidths[cellIndex];
      cell.style.maxWidth = tableColumnWidths[cellIndex];
      cell.removeAttribute("width");
      cellIndex += 1;
    });

    // Hide unknown cells (possibly for developers, invisible in IE)
    for (let i = 1; i < 4; i += 1) {
      cells[cells.length - i].style.display = "none";
    }
  });
}

// Starts extension
function LoadPolyfiller(settings: Record<string, any>) {
  if (settings.fixSummaryTable) fixColumnWidths();

  // injectScript("js/inline/improve-icons.js");
  printLine("Loaded summary tweaks!");
}

// Load settings from storage (with defaults) and run starter func
getSettings((settings: Record<string, any>) => LoadPolyfiller(settings));
