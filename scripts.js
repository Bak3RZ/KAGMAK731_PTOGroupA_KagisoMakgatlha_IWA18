// import scripts 
import { html, createOrderHtml, moveToColumn, updateDraggingHtml, focus,} from "./view";
import { COLUMNS, createOrderData, state, updateDragging } from "./data";  

// store the current order ID
let orderID = "";

// call method to focus on add button
focus();

/**
 * 
 * HELP HANDLER
 * 
 * function checks if the event target is either the help button or the close button.
 * if event target is the help button, the function shows the help overlay.
 * if the event target is the close button, the function closes the help overlay,
 * and calls the focus function when the overlay is closed.
 * */

// Event handler for clicking the "?" icon
const handleHelpToggle = (event) => {
    event.preventDefault(); // prevents default event from happening
    const isHelpButton = event.target === html.other.help; // checks if the event target is the help button
    const isCloseButton = event.target === html.help.cancel; // checks if the event target is the close button
    const helpOverlay = html.help.overlay; // gets a reference to the help overlay

    // Show/hide overlay
    if (isHelpButton) {
        helpOverlay.show();
      } else if (isCloseButton) {
        helpOverlay.close();
        focus(); // Call function when overlay is closed
      };      
    };

/**
 * 
 * ADD ORDER HANDLER
 * 
 * use overlay javascript to create a custom game overlay with specific functionalities.
 * code handles two scenarios: clicking the "Add" button and clicking the "Close" button.
 * When the "Add" button is clicked, the function checks if the event target is the "Add" button.
 * when the "Close" button is clicked, the function checks if the event target is the "Close" button.
 * the function resets the form fields by calling the reset() method on formFields.
 * 
 * function serves as an event handler for click events
 * */

const handleAddToggle = (event) => {
    const isAddButton = event.target === html.other.add; // checks if the event target is an add button.
    const isCloseButton = event.target === html.add.cancel; // checks if the event target is a cancel button
    const addOverlay = html.add.overlay; // selects the overlay elements inside add button
    const formFields = html.add.form;

    if (isAddButton) {
        addOverlay.show();
      } else if (isCloseButton) {
        addOverlay.close();
        formFields.reset(); // Clear input
        focus();
      };    
};

/**
 * SUBMIT HANDLER
 * 
 * serves as a function for form submission events by creating new orders from the form input data.
 * appends new orders to the order column, resets input fields, closes overlay and reapplies focus.
 * */

const handleAddSubmit = (event) => {
    event.preventDefault(); // prevents default event from happening
    // fetch the contents of the form input fields
    const title = html.add.title.value;
    const table = html.add.table.value;
    const addOverlay = html.add.overlay;
    const formFields = html.add.form;

    // Create new order from createData function
    const newOrder = createOrderData({ title, table, column: "ordered" });

    // Create HTML for the new order and append to the ordered column
    const newOrderHtml = createOrderHtml(newOrder);
    const orderedColumn = html.columns.ordered;
    orderedColumn.appendChild(newOrderHtml);
    formFields.reset(); // resets the input fields within the form,
    addOverlay.close(); // closes the overlay associated with the add button
    focus(); // reapplies focus to the first input field in the form
};

/**
 * EDIT HANDLER
 * 
 * serves as an event handler for clicks on order elements and the cancel button within the edit overlay.
 * checks if the clicked element is an order element or the cancel button, 
 * fetches the data-id from the order element, and identifies the form fields within the edit overlay.
 * 
 * If the clicked element is an order element, the function will display the edit overlay.
 * If the clicked element is the cancel button, the function will close the edit overlay.
 * form will therefore reset and put focus back to the main input field
 *  * */

const handleEditToggle = (event) => {
    //Check if clicked element is an order or the cancel button
    const isOrder = event.target.closest(".order"); // returns the closest ancestor element that matches the provided selector (order).
    const isCancelButton = event.target === html.edit.cancel; // compares elements. if true, cancel!
    // bottom line helps the function retrieve the reference to the form elements, allowing it to manipulate the form data or perform other actions based on the user's input.
    const formFields = html.edit.form; // assigns a reference to the form elements within the edit overlay to 'formFields '.
    // fetch 'data'id' from order element
    orderID = event.target.dataset.id;
    const editOverlay = html.edit.overlay;

    if (isOrder) {
      editOverlay.show();
    } else if (isCancelButton) {
      editOverlay.close();
      formFields.reset();
      focus();
    } ; 
};

/**
 *  DELETE HANDLER
 * 
 * an arrow function for a button click event.
 * function is triggered when the delete button is clicked, 
 * and it removes the corresponding order element from the DOM.
  */

const handleDelete = (event) => {
    const isDeleteButton = event.target === html.edit.delete; // checks if 'event.target' is the same as 'html.edit.delete'.
    const editOverlay = html.edit.overlay; // retrieves the overlay element of the edit form and assigns it to the editOverlay
    const orderHtml = document.querySelector(`[data-id="${orderID}"]`); // selects the DOM element with the specified data-id attribute and assigns it to the orderHtml.

    // line checks if statement is truthy. If true, removes selected order from DOM, closes edited overlay and resets cursor to last clicked button.
    if (isDeleteButton) {
        orderHtml.remove(); // Remove order from DOM
        editOverlay.close();
        focus();
    };
};

// EDIT SUBMIT HANDLER

const handleEditSubmit = (event) => {
    event.preventDefault(); // prevents default event from happening
    const isUpdateButton = event.target === html.edit.form;
    const editOverlay = html.edit.overlay;

    // retrive new values from edit form
    const newTitle = html.edit.title.value;
    const newTable = html.edit.table.value;
    const newStatus = html.edit.column.value;
    const formFields = html.edit.form;

    // Select order div with the matching ID
    const orderHtml = document.querySelector(`[data-id="${orderID}"]`);

    if (isUpdateButton) {
        orderHtml.querySelector("[data-order-title]").textContent = newTitle;
        orderHtml.querySelector("[data-order-table]").textContent = newTable;
        // update status of the order
        moveToColumn(orderID, newStatus);
        formFields.reset();
        editOverlay.close();
        focus();
      }; 
};

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

/** 
 * DRAGGING HANDLERS
 * 
 * function is designed to handle the dragging of an element from one column to another within a table-like structure.
 * it listens for the 'dragover' event and determines the target column where the element is being dragged over.
 * then, it updates the state and HTML of the dragging operation to reflect the new target column.
*/
const handleDragOver = (event) => { // event handler, has a const variable with one argument
    event.preventDefault(); // used to prevent browser default behaviour when dragging over an element.
    const path = event.path || event.composedPath() // get the reference to the dragged element and the target column where the element is being dragged over.
    let column = null // used to store the name of the target column

/**
 * loop through event to check elements dataset for the presence of 'area' property.
 * if 'area' is found, assign the vlaue to 'column' and break loop.
 * if 'coloumn'is still null, return nothing.
*/
    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    };
        // Update dragging state and HTML to reflect the new column
        if (!column) return
        updateDragging({ over: column })
        updateDraggingHtml({ over: column })
};

let draggedId; // ID of the order being dragged

// DRAG START HANDLER

const handleDragStart = (event) => {
    draggedId = event.target.dataset.id;
    event.dataTransfer.setData("text/plain", draggedId);
};

// DRAG END HANDLER

const handleDragEnd = (event) => {
    const data = event.dataTransfer.getData("text/plain");
    let column = "";
    
// COLUMN LOOPING
    for (const columnName of COLUMNS) {
        if (html.area[columnName].style.backgroundColor === "rgba(0, 160, 70, 0.2)")
        column = html.area[columnName]
        .querySelector('[class="grid__content"]')
        .getAttribute("data-column");
        html.area[columnName].style.backgroundColor = "";
        moveToColumn(draggedId, column);
    }
};

// EVENT LISTERNERS

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}