// Returns true if the page contains the menubar of buttons
// (buttons including adding time, delete, copy, paste etc)
 export default function pageContainsMenuBar() {
    return document.getElementById("jsddm_summary") !== undefined ||
        document.getElementById("jsddm_item") !== undefined;
}