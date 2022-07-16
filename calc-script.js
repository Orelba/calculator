// Display Values
let operatorInserted = false

// Calculator Values
const savedVals = {
  n1: '',
  n2: '',
  operator: '',
  result: '',
  resetCurrentOp: function () {
    this.n1 = ''
    this.n2 = ''
    this.operator = ''
    operatorInserted = false
  },
  resetAllVals: function () {
    this.resetCurrentOp()
    this.result = ''
  },
  continueOperation: function () {
    this.n1 = this.result.toString()
    this.n2 = ''
  }
}

function add(n1, n2) {
  return n1 + n2
}

function subtract(n1, n2) {
  return n1 - n2
}

function multiply(n1, n2) {
  return n1 * n2
}

function divide(n1, n2) {
  return n1 / n2
}

function percentage(partialValue, totalValue) {
  let result
  totalValue ? result = (((partialValue / 100) * totalValue)) : result = partialValue / 100
  if (result % 1 !== 0) result = result.toFixed(2)
  return result.toString()
}

function getInput() {
  const elDigitBtns = document.querySelectorAll('.digit')
  const elOperatorBtns = document.querySelectorAll('.operator')

  // Get Digits
  elDigitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!restrictOperationLineLength()) {
        if (operatorInserted === false) {
          if (btn.textContent === '.' && savedVals.n1.includes('.')) return 0
          savedVals.n1 += btn.textContent
        } else {
          if (btn.textContent === '.' && savedVals.n2.includes('.')) return 0
          savedVals.n2 += btn.textContent
        }

        if (savedVals.n1 && savedVals.operator && savedVals.n2) setResult()
        updateDisplay()
        setDispSectFocus('operations')
      }
    })
  })

  // Get Operator
  elOperatorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let chosenOperator = btn.getAttribute('id')
      if (savedVals.n2) {
        savedVals.operator = chosenOperator
        savedVals.continueOperation()
      } else if (!savedVals.n1 && chosenOperator === '-') {
        savedVals.n1 += chosenOperator
      } else if (savedVals.n1 && savedVals.n1 !== '-') {
        savedVals.operator = chosenOperator
        operatorInserted = true
      }

      updateDisplay()
      setDispSectFocus('operations')
    })
  })
}

function operate(operator, n1, n2) {
  n1 = parseFloat(n1)
  n2 = parseFloat(n2)

  switch (operator) {
    case '+':
      return add(n1, n2)
    case '-':
      return subtract(n1, n2)
    case '*':
      return multiply(n1, n2)
    case '/':
      return divide(n1, n2)
  }
}

function setResult() {
  if (savedVals.operator === '/' && (parseFloat(savedVals.n1) === 0 || parseFloat(savedVals.n2) === 0)) return showMathError()

  let result

  (!savedVals.n1 && !savedVals.operator && !savedVals.n2) ? result = 0 :
    result = operate(savedVals.operator, savedVals.n1, savedVals.n2)

  if (savedVals.n1 && !savedVals.n2) result = parseFloat(savedVals.n1)

  if (result % 1 !== 0) result = parseFloat(result.toFixed(4))
  if (result.toString().length > 13) result = result.toExponential(2)

  savedVals.result = result

  updateDisplay()
  setDispSectFocus('result')
}

function allClear() {
  const elDisplay = document.querySelectorAll('.display')

  elDisplay.forEach(displayElement => {
    displayElement.textContent = ''
    savedVals.resetAllVals()
  })
}

function backspace() {
  const operationsByReversedOrder = ['n2', 'operator', 'n1']
  for (let item of operationsByReversedOrder) {
    if (savedVals[item]) {
      if (savedVals[item].length !== 1) {
        savedVals[item] = savedVals[item].substring(0, savedVals[item].length - 1)
        break
      } else if (savedVals[item].length === 1) {
        savedVals[item] = ''
        if (item === 'operator') operatorInserted = false
        break
      }
    }
  }

  if (savedVals.result && savedVals.n2) {
    setResult()
  } else {
    savedVals.result = ''
    updateDisplay()
  }
  savedVals.n1 ? setDispSectFocus('operations') : setDispSectFocus('result')
}

function convertToPercentage() {
  if (savedVals.n2) {
    savedVals.n2 = percentage(savedVals.n2, savedVals.n1)
  } else if (savedVals.n1 && savedVals.n1 !== '-') {
    savedVals.n1 = percentage(savedVals.n1)
  }

  setResult()
  updateDisplay()
  setDispSectFocus('operations')
}

// Display Functionality
function updateDisplay() {
  const elOperationsDispSect = document.querySelector('.operations')
  const elResultDispSect = document.querySelector('.result')

  elOperationsDispSect.textContent = `${savedVals.n1} ${savedVals.operator} ${savedVals.n2}`
  elResultDispSect.textContent = (savedVals.result) ? savedVals.result : ''

  // Show 0 On Display
  if (savedVals.result.toString() === '0') elResultDispSect.textContent = '0'
}

function setDispSectFocus(section) {
  const elDisplay = document.querySelectorAll('.display')

  if (section === 'operations' && elDisplay[1].classList.contains('focus')) {
    elDisplay.forEach(element => element.classList.toggle('focus'))
  } else if (section === 'result' && elDisplay[0].classList.contains('focus')) {
    elDisplay.forEach(element => element.classList.toggle('focus'))
  }
}

function restrictOperationLineLength() {
  if (savedVals.n1.length >= 13 && !savedVals.operator) {
    return true
  } else if (savedVals.n2.length >= 12) {
    return true
  }
}

function showMathError() {
  const elResultDispSect = document.querySelector('.result')
  elResultDispSect.textContent = 'Math Error!'
}

// Calculator
function calculator() {
  const elACBtn = document.querySelector('#ac')
  const elDeleteBtn = document.querySelector('#delete')
  const elEqualsBtn = document.querySelector('.equals-btn')
  const elPercentBtn = document.querySelector('#percent')

  getInput()

  // All Clear Button
  elACBtn.addEventListener('click', () => allClear())
  // Delete Button
  elDeleteBtn.addEventListener('click', () => backspace())
  // Percentage Button
  elPercentBtn.addEventListener('click', () => convertToPercentage())
  // Equals Button
  elEqualsBtn.addEventListener('click', () => setResult())
}

calculator()

// To Add:
// Support for keyboard