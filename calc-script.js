// Calculator Buttons
const elDigitBtns = document.querySelectorAll('.digit')
const elOperatorBtns = document.querySelectorAll('.operator')
const elACBtn = document.querySelector('#ac')
const elDeleteBtn = document.querySelector('#delete')
const elEqualsBtn = document.querySelector('.equals-btn')
const elPercentBtn = document.querySelector('#percent')

// Display Values
let operatorInserted = false
let mathError = false

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

//Input Handling
elDigitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    appendInput(btn.textContent)
  })
})
elOperatorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    appendInput(btn.getAttribute('id'))
  })
})
elACBtn.addEventListener('click', () => allClear())
elDeleteBtn.addEventListener('click', () => backspace())
elPercentBtn.addEventListener('click', () => convertToPercentage())
elEqualsBtn.addEventListener('click', () => setResult())

window.addEventListener('keydown', handleKeyboardInput)

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9 || e.key === '.' || e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendInput(e.key)
  if (e.key === '=' || e.key === 'Enter') setResult()
  if (e.key === 'Backspace') backspace()
  if (e.key === 'Escape') allClear()
  if (e.key === '%') convertToPercentage()
}

function appendInput(input) {
  switch (input) {
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
    case '.':
      if (savedVals.n1.length < 13 && !savedVals.operator || savedVals.n2.length < 12 && savedVals.operator) {
        if (operatorInserted === false) {
          if (input === '.' && savedVals.n1.includes('.')) return 0
          savedVals.n1 += input
        } else {
          if (input === '.' && savedVals.n2.includes('.')) return 0
          savedVals.n2 += input
        }

        if (savedVals.n1 && savedVals.operator && savedVals.n2) setResult()
        updateDisplay()
        setDispSectFocus('operations')
      }
      break
    case '+':
    case '-':
    case '*':
    case '/':
      if (savedVals.n2 && !mathError) {
        savedVals.operator = input
        savedVals.continueOperation()
      } else if (!savedVals.n1 && input === '-') {
        savedVals.n1 += input
      } else if (savedVals.n1 && savedVals.n1 !== '-') {
        savedVals.operator = input
        operatorInserted = true
      }

      updateDisplay()
      setDispSectFocus('operations')
  }
}

// Operation Handling
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
  mathError = false

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

function showMathError() {
  updateDisplay()
  const elResultDispSect = document.querySelector('.result')
  elResultDispSect.textContent = 'Math Error!'
  mathError = true
}