document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    setupRadioButtons();
    setupMainCheckboxes();
    autofillManualForm();
    toggleForms();
});

function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const jumpClass = urlParams.get('class') ?? "rookie";
    setOptions(jumpClass);
    document.getElementById("form-random").addEventListener("change", toggleForms);
    document.getElementById("form-manual").addEventListener("change", toggleForms);
    document.getElementById("add_rows").addEventListener("click", addRows);
}

function toggleDiveCustomForm() {
    const diveWrapper = document.getElementById("dive-options-wrapper");
    diveWrapper.classList.contains("visible") ? hideDiveCustomForm() : showDiveCustomForm();
}

function showDiveCustomForm() {
    document.getElementById("dive-options-wrapper").classList.add("visible");
    document.getElementById("dive-options-toggle").innerHTML = "Hide options";
}

function hideDiveCustomForm() {
    document.getElementById("dive-options-wrapper").classList.remove("visible");
    document.getElementById("dive-options-toggle").innerHTML = "Show options";
}

function setRadioValue(value) {
    const radioButton = document.querySelector(`input[name="class"][value="${value}"]`);
    if (radioButton) {
        radioButton.checked = true;
    } else {
        console.log("Radio button with value", value, "not found.");
    }
}

function setupRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="class"]');
    radioButtons.forEach(radio => radio.addEventListener("change", (event) => setOptions(event.target.value)));
}

function setOptions(jumpClass) {
    let numPoints;
    switch (jumpClass) {
        case "rookie":
            numPoints = 3;
            configureFormations(["random"], ["a_block", "aa_block", "aaa_block"]);
            break;
        case "a":
            numPoints = 3;
            configureFormations(["random", "a_block"], ["aa_block", "aaa_block"]);
            break;
        case "aa":
            numPoints = 4;
            configureFormations(["random", "a_block", "aa_block"], ["aaa_block"]);
            break;
        case "aaa":
            numPoints = 5;
            configureFormations(["random", "a_block", "aa_block", "aaa_block"]);
            break;
        case "custom":
            numPoints = getCustomNumPoints();
            toggleCustomOptions(true);
            break;
    }
    document.getElementById("num_points").value = numPoints;
}

function configureFormations(enable, disable = []) {
    enable.forEach(type => checkFormations(type));
    disable.forEach(type => checkFormations(type, false));
    disableAll();
}

function getCustomNumPoints() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("num_points") ?? document.getElementById("num_points").value;
}

function toggleCustomOptions(enable) {
    if (enable) {
        showDiveCustomForm();
        disableAll(false);
        checkCustomFormations();
    } else {
        disableAll();
    }
}

function checkFormations(type, checked = true) {
    document.querySelectorAll(`input[type="checkbox"][id^="${type}"]`)
        .forEach(checkbox => checkbox.checked = checked);
}

function checkCustomFormations() {
    const params = new URLSearchParams(window.location.search);
    ["random-", "a_block-", "aa_block-", "aaa_block-"].forEach(prefix => {
        params.forEach((value, key) => {
            if (key.startsWith(prefix) && value === "on") {
                document.getElementById(key).checked = true;
            }
        });
    });
}

function disableAll(state = true) {
    const parentDiv = document.getElementById("dive-options-wrapper");
    parentDiv.classList.toggle("disabled", state);
    parentDiv.querySelectorAll('*').forEach(child => {
        if (child instanceof HTMLInputElement || child instanceof HTMLButtonElement) {
            child.disabled = state;
        }
    });
}

function printProgram() {
    const printWindow = window.open("", "title", "attributes");
    const printContent = document.getElementById("full-program").innerHTML;
    printWindow.document.write(printContent);
    printWindow.document.write(`
        <title>${window.location.href}</title>
        <style>
            .jump-program {
                display: flex;
                gap: 5px;
                align-items: center;
                margin-bottom: 2rem;
            }
            .list-index {
                width: 1.5rem;
                flex-shrink: 0;
            }
            .img-wrapper img {
                width: 100%;
                height: auto;
            }
        </style>
    `);

    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (isFirefox) {
        printWindow.print();
        printWindow.close();
    } else {
        printWindow.onafterprint = function() {
            printWindow.close();
        };
        printWindow.print();
    }
}

function setupMainCheckboxes() {
    setupMainCheckbox("randoms", "random-");
    setupMainCheckbox("a_blocks", "a_block-");
    setupMainCheckbox("aa_blocks", "aa_block-");
    setupMainCheckbox("aaa_blocks", "aaa_block-");

    document.getElementById("randoms").addEventListener('change', function() {
        checkFormations("random", this.checked);
    });

    document.getElementById("a_blocks").addEventListener('change', function() {
        checkFormations("a_block", this.checked);
    });

    document.getElementById("aa_blocks").addEventListener('change', function() {
        checkFormations("aa_block", this.checked);
    });

    document.getElementById("aaa_blocks").addEventListener('change', function() {
        checkFormations("aaa_block", this.checked);
    });
}

function setupMainCheckbox(mainCheckboxId, subCheckboxPrefix) {
    const mainCheckbox = document.getElementById(mainCheckboxId);
    const subCheckboxes = document.querySelectorAll(`input[type="checkbox"][name^="${subCheckboxPrefix}"]`);

    function updateMainCheckbox() {
        const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
        const noneChecked = Array.from(subCheckboxes).every(cb => !cb.checked);
        mainCheckbox.checked = allChecked;
        mainCheckbox.indeterminate = !allChecked && !noneChecked;
    }

    subCheckboxes.forEach(cb => cb.addEventListener("change", updateMainCheckbox));
    updateMainCheckbox();
}

function generateUrl(event) {
    event.preventDefault();
  
    const form = document.getElementById("manualForm");
    const rows = [];
  
    // Loop through rows and columns to collect the data
    for (let i = 0; i < 10; i++) {
        const row = [];
        for (let j = 0; j < 6; j++) {
            const input = document.getElementById(`f${i}${j}`);
            if (input && input.value.trim() !== "") {
                row.push(input.value.trim());
            }
        }
        if (row.length > 0) {
            rows.push(row.join("-"));
        }
    }
  
    // Generate the URL
    const programParam = rows.join(",");
    const customUrl = `?program=${encodeURIComponent(programParam)}`;
  
    // Redirect the user to the new URL
    window.location.href = customUrl;
}

function autofillManualForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const program = urlParams.get("program");
  
    if (!program) return;
  
    // Split the program into rows and values
    const rows = program.split(",");
    rows.forEach((row, i) => {
        const values = row.split("-");
        values.forEach((value, j) => {
            const input = document.getElementById(`f${i}${j}`);
            if (input) {
                input.value = value; // Autofill the input
            }
        });
    });
}

function toggleForms() {
    // Get the selected value
    const randomRadio = document.getElementById("form-random");
    const manualRadio = document.getElementById("form-manual");
    
    // Get the forms
    const randomForm = document.getElementById("randomForm");
    const manualForm = document.getElementById("manualForm");
  
    // Show/hide based on selection
    if (randomRadio.checked) {
        randomForm.style.display = "block";
        manualForm.style.display = "none";
    }
    else if (manualRadio.checked) {
        manualForm.style.display = "block";
        randomForm.style.display = "none";
    }
}

// Function to add 5 more rows
function addRows() {
    const rowsContainer = document.getElementById("rows-container");
    const currentRows = rowsContainer.querySelectorAll(".flex-row").length; // Count existing rows
    const numColumns = 6; // Adjust if the number of columns changes dynamically

    for (let i = 0; i < 5; i++) {
        const rowIndex = currentRows + i; // New row index
        const row = document.createElement("div");
        row.className = "flex-row";

        // Add the row index
        const indexDiv = document.createElement("div");
        indexDiv.className = "list-index";
        indexDiv.textContent = `${rowIndex + 1}.`;
        row.appendChild(indexDiv);

        // Add input fields for the row
        for (let colIndex = 0; colIndex < numColumns; colIndex++) {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form";
            input.maxLength = 2;
            input.autocomplete = "off";
            input.id = `f${rowIndex}${colIndex}`;
            input.name = `f${rowIndex}${colIndex}`;
            row.appendChild(input);
        }

        rowsContainer.appendChild(row); // Add the row to the container
    }
}
