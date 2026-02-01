// -------------------- Initialization --------------------
document.addEventListener("DOMContentLoaded", () => {
    const rowsContainer = document.getElementById("rows-container");
    const clearAllBtn = document.getElementById("clear-all-btn");

    initPage(rowsContainer);
    setupRadioButtons();
    setupMainCheckboxes();
    toggleForms();

    // Clear all inputs in all rows
    clearAllBtn.addEventListener("click", () => clearAllRows(rowsContainer));

    // Delegated row button handling
    rowsContainer.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const row = button.closest(".flex-row");
        if (!row) return;

        switch (button.dataset.action) {
            case "clear":
                clearRow(row);
                break;
            case "delete":
                deleteRow(row, rowsContainer);
                break;
        }
    });

    // -------------------- Modal --------------------
    const modal = document.getElementById("programModal");
    const modalBody = modal.querySelector(".modal-body");

    document.getElementById("full-program").addEventListener("click", event => {
        const row = event.target.closest(".jump-program");
        if (!row) return;

        modalBody.innerHTML = "";
        row.querySelectorAll(".img-wrapper").forEach(wrapper => {
            const clone = wrapper.cloneNode(true);
            modalBody.appendChild(clone);
        });

        modal.style.display = "flex";
    });

    window.addEventListener("click", event => {
        if (event.target === modal) modal.style.display = "none";
    });
});





// -------------------- Row helpers --------------------
const clearRow = row => {
    row.querySelectorAll("input.form").forEach(input => input.value = "");
};

const clearAllRows = container => {
    container.querySelectorAll(".flex-row input.form").forEach(input => input.value = "");
};

const deleteRow = (row, container) => {
    const rows = Array.from(container.querySelectorAll(".flex-row"));
    const rowIndex = rows.indexOf(row);
    if (rowIndex === -1) return;

    // Shift values up
    for (let i = rowIndex; i < rows.length - 1; i++) {
        const currentInputs = rows[i].querySelectorAll("input.form");
        const nextInputs = rows[i + 1].querySelectorAll("input.form");
        currentInputs.forEach((input, idx) => input.value = nextInputs[idx]?.value || "");
    }

    // Remove last row from DOM
    rows[rows.length - 1].remove();
};

const addRow = () => {
    const rowsContainer = document.getElementById("rows-container");
    const rowIndex = rowsContainer.querySelectorAll(".flex-row").length;
    const numColumns = parseInt(new URLSearchParams(window.location.search).get("num_points"), 10) || 5;

    const row = document.createElement("div");
    row.className = "flex-row";

    // Index label
    const indexDiv = document.createElement("div");
    indexDiv.className = "list-index";
    indexDiv.textContent = `${rowIndex + 1}`;
    row.appendChild(indexDiv);

    // Inputs
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
        const input = document.createElement("input");
        Object.assign(input, {
            type: "text",
            className: "form",
            maxLength: 2,
            autocomplete: "off",
            id: `f${rowIndex}${colIndex}`,
            name: `f${rowIndex}${colIndex}`
        });
        row.appendChild(input);
    }

    // Clear button
    row.appendChild(createButton("←", "clear"));
    // Delete button
    row.appendChild(createButton("×", "delete"));

    rowsContainer.appendChild(row);
};

const createButton = (text, action) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn mb-0 ${action}`;
    btn.textContent = text;
    btn.dataset.action = action;
    return btn;
};

// -------------------- Page init --------------------
const initPage = (rowsContainer) => {
    const urlParams = new URLSearchParams(window.location.search);
    setCustomOptions(urlParams.get('class') ?? "aaa");

    document.getElementById("form-random").addEventListener("change", toggleForms);
    document.getElementById("form-manual").addEventListener("change", toggleForms);
    document.getElementById("add_row").addEventListener("click", addRow);
    document.getElementById("randomForm").addEventListener("submit", handleRandomSubmit);

};

// -------------------- Form toggle --------------------
const toggleForms = () => {
    const randomRadio = document.getElementById("form-random");
    const randomForm = document.getElementById("randomForm");
    const manualForm = document.getElementById("manualForm");

    if (randomRadio.checked) {
        randomForm.style.display = "flex";
        manualForm.style.display = "none";
    } else {
        manualForm.style.display = "flex";
        randomForm.style.display = "none";
    }
};

// -------------------- Radio buttons --------------------
const setupRadioButtons = () => {
    document.querySelectorAll('input[name="class"]').forEach(radio => {
        radio.addEventListener("change", event => setCustomOptions(event.target.value));
    });
};

const setRadioValue = value => {
    const radioButton = document.querySelector(`input[name="class"][value="${value}"]`);
    if (radioButton) radioButton.checked = true;
};

// -------------------- Custom options --------------------
const setCustomOptions = jumpClass => {
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
};

const configureFormations = (enable, disable = []) => {
    enable.forEach(type => checkFormations(type));
    disable.forEach(type => checkFormations(type, false));
};

const getCustomNumPoints = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("num_points") ?? document.getElementById("num_points").value;
};

const toggleCustomOptions = enable => {
    if (enable) {
        showDiveCustomForm();
        checkCustomFormations();
    }
};

// -------------------- Dive custom form --------------------
const toggleDiveCustomForm = () => {
    const wrapper = document.getElementById("dive-options-wrapper");
    wrapper.classList.contains("visible") ? hideDiveCustomForm() : showDiveCustomForm();
};

const showDiveCustomForm = () => {
    document.getElementById("dive-options-wrapper").classList.add("visible");
    document.getElementById("dive-options-toggle").textContent = "Hide options";
};

const hideDiveCustomForm = () => {
    document.getElementById("dive-options-wrapper").classList.remove("visible");
    document.getElementById("dive-options-toggle").textContent = "Show options";
};

// -------------------- Checkboxes --------------------
const setupMainCheckboxes = () => {
    setupMainCheckbox("randoms", "random-");
    setupMainCheckbox("a_blocks", "a_block-");
    setupMainCheckbox("aa_blocks", "aa_block-");
    setupMainCheckbox("aaa_blocks", "aaa_block-");

    const wrapper = document.getElementById("dive-options-wrapper");

    wrapper.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener("change", () => {
            const current = document.querySelector('input[name="class"]:checked');
            if (current && current.value !== "custom") {
                setRadioValue("custom");
                setCustomOptions("custom");
            }
        });
    });
};

const setupMainCheckbox = (mainId, prefix) => {
    const mainCheckbox = document.getElementById(mainId);
    const subCheckboxes = document.querySelectorAll(`input[type="checkbox"][name^="${prefix}"]`);

    const update = () => {
        const allChecked = Array.from(subCheckboxes).every(cb => cb.checked);
        const noneChecked = Array.from(subCheckboxes).every(cb => !cb.checked);
        mainCheckbox.checked = allChecked;
        mainCheckbox.indeterminate = !allChecked && !noneChecked;
    };

    subCheckboxes.forEach(cb => cb.addEventListener("change", update));
    update();

    // Also toggle all sub checkboxes when main changes
    mainCheckbox.addEventListener("change", () => {
        subCheckboxes.forEach(cb => cb.checked = mainCheckbox.checked);
    });
};

const checkFormations = (type, checked = true) => {
    document.querySelectorAll(`input[type="checkbox"][id^="${type}"]`)
        .forEach(cb => cb.checked = checked);
};

const checkCustomFormations = () => {
    const params = new URLSearchParams(window.location.search);
    ["random-", "a_block-", "aa_block-", "aaa_block-"].forEach(prefix => {
        params.forEach((value, key) => {
            if (key.startsWith(prefix) && value === "on") {
                document.getElementById(key).checked = true;
            }
        });
    });
};


// -------------------- Submit --------------------
const handleRandomSubmit = event => {
    const selectedClass = document.querySelector('input[name="class"]:checked')?.value;

    // only keep checkboxes when custom
    if (selectedClass !== "custom") {
        const form = event.target;

        form.querySelectorAll('#dive-options-wrapper input[type="checkbox"]')
            .forEach(cb => cb.removeAttribute("name")); 
    }
};


// -------------------- Print --------------------
const printProgram = () => {
    const printWindow = window.open("", "_blank");
    const printContent = document.getElementById("full-program").innerHTML;

    printWindow.document.write(printContent);
    printWindow.document.write(`
        <title>${window.location.href}</title>
        <style>
            .jump-program { display: flex; gap: 5px; align-items: center; margin-bottom: 2rem; }
            .list-index { width: 1rem; flex-shrink: 0; }
            .img-wrapper img { width: 100%; height: auto; }
        </style>
    `);

    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    if (isFirefox) {
        printWindow.print();
        printWindow.close();
    } else {
        printWindow.onafterprint = () => printWindow.close();
        printWindow.print();
    }
};

// -------------------- URL generation --------------------
const generateUrl = event => {
    event.preventDefault();
    const rows = [];

    document.querySelectorAll("#rows-container .flex-row").forEach(rowEl => {
        const row = Array.from(rowEl.querySelectorAll("input.form"))
            .map(input => input.value.trim())
            .filter(v => v !== "");
        if (row.length) rows.push(row.join("-"));
    });

    window.location.href = `?program=${rows.join("_")}`;
};



