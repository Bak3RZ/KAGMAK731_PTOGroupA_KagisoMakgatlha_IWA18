/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */

// Import from nomudule scripts
import { html, createOrderHtml, moveToColumn, updateDraggingHtml, focus,} from "view.js";
import { COLUMNS, createOrderData, state, updateDragging } from "data.js";  

// call method to focus on add button
window.addEventListener('load', () => {
    html.other.add.focus(); 
});

// sets the column variable to the name of the current column and updates the dragging status.
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}

const handleDragStart = (event) => {}
const handleDragEnd = (event) => {}

// Function to open/close Help overlay
const toggleHelpOverlay = () => {
    const helpOverlay = document.getElementById('data-help-overlay');
    const addOrderButton = html.other.add;

    // Check if overlay is currently visible
    const isHelpOverlayVisible = helpOverlay.style.display !== 'none';
    // Toggle the visibility of the help overlay
    helpOverlay.style.display = isHelpOverlayVisible ? 'none' : 'block';
    // If the help overlay is being closed, set focus to the "Add Order" button
    if (isHelpOverlayVisible) {
        addOrderButton.focus();
    }
};
// Q: Why do we need the overlay?

// Event handler for clicking the "?" icon
const handleHelpToggle = (event) => {
        event.preventDefault();
        toggleHelpOverlay();   
}
// Event handler for clicking the "Close" button in the Help overlay
const handleCloseHelp = () => {
    toggleHelpOverlay();
};

const handleAddToggle = (event) => {}
const handleAddSubmit = (event) => {}
const handleEditToggle = (event) => {}
const handleEditSubmit = (event) => {}
const handleDelete = (event) => {}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)
// Add event listener for the "Close" button in the Help overlay
document.getElementById('help-close-button').addEventListener('click', handleCloseHelp);

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}