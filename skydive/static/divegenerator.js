document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    setupRadioButtons();
    setupMainCheckboxes();
    toggleForms();

    document.getElementById("clear-all-btn").addEventListener("click", () => {
        document.querySelectorAll("#rows-container .flex-row input").forEach(input => input.value = "");
    });


    document.getElementById("rows-container").addEventListener("click", function (event) {
        if (
            event.target.classList.contains("btn") &&
            event.target.dataset.action === "clear"
        ) {
            const row = event.target.closest(".flex-row");
            if (row) {
                row.querySelectorAll("input").forEach(input => input.value = "");
            }
        }
    });

    document.getElementById("rows-container").addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action='delete']");
        if (!button) return;

        const row = button.closest(".flex-row");
        if (!row) return;

        const container = document.getElementById("rows-container");
        const rows = Array.from(container.querySelectorAll(".flex-row"));
        const rowIndex = rows.indexOf(row);

        if (rowIndex === -1) return;

        // Shift values upward
        for (let i = rowIndex; i < rows.length - 1; i++) {
            const currentInputs = rows[i].querySelectorAll("input.form");
            const nextInputs = rows[i + 1].querySelectorAll("input.form");

            currentInputs.forEach((input, idx) => {
                input.value = nextInputs[idx]?.value || "";
            });
        }

        // Remove the last row from the DOM
        const lastRow = rows[rows.length - 1];
        lastRow.remove();

        // Optional: update visible indices
        container.querySelectorAll(".list-index").forEach((el, idx) => {
            el.textContent = `${idx + 1}.`;
        });
    });


});

function initializePage() {
    const url = new URL(window.location);
    const params = url.searchParams;

    const hasProgram = params.has("program");
    const formType = hasProgram ? "manual": params.get("form") || "random";

    // Normalize URL
    params.set("form", formType);
    window.history.replaceState({}, "", url);

    document.getElementById("form-random").checked = formType === "random";
    document.getElementById("form-manual").checked = formType === "manual";

    setOptions(params.get("class") ?? "aaa");

    document.getElementById("form-random").addEventListener("change", toggleForms);
    document.getElementById("form-manual").addEventListener("change", toggleForms);
    document.getElementById("add_row").addEventListener("click", addRow);

    // Render without rewriting URL again
    toggleForms(false);
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

    const rows = [];

    document.querySelectorAll("#rows-container .flex-row").forEach(rowEl => {
        const row = [];

        rowEl.querySelectorAll("input.form").forEach(input => {
            if (input.value.trim() !== "") {
                row.push(input.value.trim());
            }
        });

        if (row.length > 0) {
            rows.push(row.join("-"));
        }
    });

    const customUrl = `?program=${rows.join("_")}`;
    window.location.href = customUrl;
}


function toggleForms(updateUrl = true) {
    const randomRadio = document.getElementById("form-random");
    const manualRadio = document.getElementById("form-manual");
    
    const randomForm = document.getElementById("randomForm");
    const manualForm = document.getElementById("manualForm");

    let formType;

    if (randomRadio.checked) {
        randomForm.style.display = "flex";
        manualForm.style.display = "none";
        formType = "random";
    }
    else {
        manualForm.style.display = "flex";
        randomForm.style.display = "none";
        formType = "manual";
    }

    if (updateUrl) {
        const url = new URL(window.location);
        url.searchParams.set("form", formType);
        window.history.replaceState({}, "", url);
    }
}


function addRow() {
    const rowsContainer = document.getElementById("rows-container");
    const rows = rowsContainer.querySelectorAll(".flex-row");
    const rowIndex = rows.length;

    const urlParams = new URLSearchParams(window.location.search);
    const numColumns = parseInt(urlParams.get("num_points"), 10) || 5;

    const row = document.createElement("div");
    row.className = "flex-row";

    // Index label
    const indexDiv = document.createElement("div");
    indexDiv.className = "list-index";
    indexDiv.textContent = `${rowIndex + 1}.`;
    row.appendChild(indexDiv);

    // Inputs
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

    // Clear button
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "btn mb-0 clear";
    clearButton.textContent = "←";
    clearButton.dataset.action = "clear";
    row.appendChild(clearButton);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn mb-0 delete";
    deleteButton.textContent = "×";
    deleteButton.dataset.action = "delete";
    row.appendChild(deleteButton);

    rowsContainer.appendChild(row);
}
