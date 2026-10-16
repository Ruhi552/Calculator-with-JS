
const display = document.getElementById("display");
const previous = document.getElementById("previous");

let firstNumber = null;
let operator = null;
let waitingForSecond = false;

// Mathematical functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// Main calculation function
function calculate(operator, a, b) {
    if (operator === "+") return add(a, b);
    if (operator === "-") return subtract(a, b);
    if (operator === "*") return multiply(a, b);

    if (operator === "/") {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return divide(a, b);
    }
}

// Show numbers on display
function enterNumber(number) {
    if (display.value === "Error") clear();

    if (waitingForSecond) {
        display.value = number;
        waitingForSecond = false;
    } else {
        display.value =
            display.value === "0"
                ? number
                : display.value + number;
    }
}

// Choose an operator
function chooseOperator(nextOperator) {
    if (display.value === "Error") return;

    const current = Number(display.value);

    if (operator && !waitingForSecond) {
        performCalculation();
    }

    firstNumber = Number(display.value);
    operator = nextOperator;
    waitingForSecond = true;

    previous.textContent =
        firstNumber + " " + nextOperator;
}

// Perform calculation
function performCalculation() {
    if (operator === null || waitingForSecond) return;

    const secondNumber = Number(display.value);

    try {
        const result = calculate(
            operator,
            firstNumber,
            secondNumber
        );

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        previous.textContent =
            firstNumber + " " + operator + " " +
            secondNumber + " =";

        display.value = String(
            Number(result.toPrecision(10))
        );

        firstNumber = null;
        operator = null;
        waitingForSecond = true;
    } catch (error) {
        display.value = "Error";
        previous.textContent = error.message;
        firstNumber = null;
        operator = null;
        waitingForSecond = true;
    }
}

// Clear everything
function clear() {
    display.value = "0";
    previous.textContent = "";
    firstNumber = null;
    operator = null;
    waitingForSecond = false;
}

// Delete the last digit
function deleteNumber() {
    if (display.value === "Error" || waitingForSecond) {
        clear();
        return;
    }

    display.value = display.value.slice(0, -1) || "0";
}

// Decimal point
function addDecimal() {
    if (display.value === "Error") clear();

    if (waitingForSecond) {
        display.value = "0.";
        waitingForSecond = false;
    } else if (!display.value.includes(".")) {
        display.value += ".";
    }
}

// Positive and negative numbers
function changeSign() {
    if (display.value === "Error") return;

    if (display.value !== "0") {
        display.value = String(-Number(display.value));
    }
}

// Connect all buttons
document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        enterNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "clear") clear();
        if (action === "delete") deleteNumber();
        if (action === "decimal") addDecimal();
        if (action === "sign") changeSign();
        if (action === "equals") performCalculation();
    });
});
