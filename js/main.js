/* Math operations */
function operate (operator, num1, num2) {
    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return substract(num1, num2);
        case '*':
            return multiply(num1, num2);
        case '/':
            return divide(num1, num2);
    }
}

function add (num1, num2) {
    return +num1 + +num2
}

function substract (num1, num2) {
    return num1 - num2
}

function multiply (num1, num2) {
    return +num1 * +num2
}

function divide (num1, num2) {
    return num1 / num2
}

/* clear */
function clear () {
    displayValue = []
    displayPreviousOperation.textContent = '';
    floatEnabled = true;
    operatorEnabled = true;
}

/* add previous Operation and result to history*/
function addHistory () {
    let newDiv = document.createElement('div');
    let opPara = document.createElement('p');
    let resulth3 = document.createElement('h3');

    newDiv.classList = 'ophistory'
    
    opPara.textContent = displayPreviousOperation.textContent
    resulth3.textContent = displayValue.join('')

    newDiv.appendChild(opPara);
    newDiv.appendChild(resulth3);
    historyDisplay.insertBefore(newDiv, historyDisplay.firstChild);
 }

/* Get DOM queries and set main variables*/
const displayPreviousOperation = document.querySelector('#operation');
const displayOperation = document.querySelector('#operand');
const historyDisplay = document.querySelector('#historyDisplay')
let displayValue = []
let floatEnabled = true;
let operatorEnabled = true;
const operators = {'+':0, '-':1, '/':2, '*':3}

const buttons = document.querySelectorAll('.btn');

/* Event Listeners */
buttons.forEach(button => button.addEventListener('click', (e) => getOperationInput(e)))
window.addEventListener('keyup', (e) => getOperationInput(e))

/* Pre-show, get the main operation ready to be parsed */
function getOperationInput (e) {
        if (displayOperation.textContent == 0) displayOperation.textContent = '';

        let value = (e.key) ? e.key : e.target.textContent;
        switch (value) {
            case '+':
            case '-':
            case '/':
            case '*':
                if (operatorEnabled) displayValue.push(value)
                operatorEnabled = false
                e.preventDefault()
                floatEnabled = true;
                break;
            case '.':
                if (floatEnabled) displayValue.push('.');
                floatEnabled = false;
                break;
            case 'Backspace':
            case 'Delete':
            case 'DEL':
                if (displayValue[displayValue.length-1] in operators) operatorEnabled = true;
                if (displayValue[displayValue.length-1] == '.') floatEnabled = true;
                if (displayValue.length > 0) displayValue.pop();
                break;
            case 'c':
            case 'C':
                clear()
                break;
            case 'Enter':
            case '=':
                displayPreviousOperation.textContent = displayValue.join('')
                displayValue = parseOperation(displayValue.join(''))
                addHistory()
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                displayValue.push(value)
                operatorEnabled = true;
                break;
        }
        displayOperation.textContent = (displayValue.length > 0) ? displayValue.join('') : 0
}

/* Parsing the display value - the main Event*/
function parseOperation (operation) {
    // regex expressions: check for negative numbers followed by || (pe)MDAS operations
    const regexLibrary = [
        /^-\d*\.?\d*\*\d*\.?\d*|[^+\-\/]\d*\.?\d*\*\d*\.?\d*/,
        /^-\d*\.?\d*\/\d*\.?\d*|[^+\-\*]\d*\.?\d*\/\d*\.?\d*/,
        /^-\d*\.?\d*\+\d*\.?\d*|[^\-\*\/]\d*\.?\d*\+\d*\.?\d*/,
        /^-\d*\.?\d*\-\d*\.?\d*|[^+\*\/]\d*\.?\d*\-\d*\.?\d*/
    ]

    // for every regex check if operation contains a match, if so replace if by the result of operate()
    for (let i = 0; i < regexLibrary.length; i++) {
        let operands;
        while (operation.match(regexLibrary[i])) {
            let operator = (i == 0) ? '*': (i == 1) ? '/':(i == 2) ? '+': '-';
            let regexMatch = operation.match(regexLibrary[i]);
            regexMatch = regexMatch.join('');
            
            // if first number is negative, and the loop handles substractions, replace second - by + to avoid errors
            if (operator == '-' && regexMatch[0] == '-') {
                let secondMinus = regexMatch.indexOf('-', regexMatch.indexOf('-')+1)
                let newMatch = [regexMatch.slice(0,secondMinus), '+', regexMatch.slice(secondMinus+1)].join('')
        
                operands = newMatch.split('+')
            } else {
                operands = regexMatch.split(operator);
            }
            
            
            let newValue = operate(operator, operands[0], operands[1]);
            operation = operation.replace(regexMatch, newValue)
        }
    }

    // Clean the result if it's a long float, display snarky message if it's Infinity
    if (!Number.isInteger(+operation)) operation = (+operation).toFixed(2);
    if (!Number.isFinite(+operation)) operation = "To infinity and beyond!";
    return operation.split('')
}

function getPosition (string, subString, index) {

}