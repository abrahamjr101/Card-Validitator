const cardInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");
const cardTypeDiv = document.getElementById("cardType");
const validationDiv = document.getElementById("validationResult");
const validateBtn = document.getElementById("validateBtn");

// Format card number with spaces
cardInput.addEventListener("input", () => {
  let number = cardInput.value.replace(/\D/g, "").substring(0,19);
  cardInput.value = number.replace(/(.{4})/g, "$1 ").trim();

  let type = detectCardType(number);
  cardTypeDiv.textContent = type ? 'Card Type: ${type}' : "Unknown Card";
});

// Format expiry MM/YY
expiryInput.addEventListener("input", () => {
  let val = expiryInput.value.replace(/\D/g, "");
  if (val.length >= 3) {
    expiryInput.value = val.substring(0,2) + "/" + val.substring(2,4);
  } else {
    expiryInput.value = val;
  }
});

validateBtn.addEventListener("click", () => {
  let number = cardInput.value.replace(/\D/g, "");
  let expiry = expiryInput.value;
  let cvv = cvvInput.value;

  if (!luhnCheck(number)) {
    validationDiv.textContent = "❌ Invalid Card Number";
    validationDiv.className = "invalid";
    return;
  }

  if (!validateExpiry(expiry)) {
    validationDiv.textContent = "❌ Invalid Expiry Date";
    validationDiv.className = "invalid";
    return;
  }

  if (!/^[0-9]{3,4}$/.test(cvv)) {
    validationDiv.textContent = "❌ Invalid CVV";
    validationDiv.className = "invalid";
    return;
  }

  validationDiv.textContent = "✅ Card is valid!";
  validationDiv.className = "valid";
});

// Detect card type
function detectCardType(number) {
  const re = {
    visa: /^4[0-9]{12,18}$/,
    mastercard: /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-7][0-9]{13}))$/,
    verve: /^(5060|5061|650[0-9])[0-9]{12,15}$/
  };
  if (re.visa.test(number)) return "Visa";
  if (re.mastercard.test(number)) return "Mastercard";
  if (re.verve.test(number)) return "Verve";
  return null;
}

// Luhn check
function luhnCheck(num) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10 === 0);
}

// Expiry validation
function validateExpiry(expiry) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  let [mm, yy] = expiry.split("/").map(x => parseInt(x,10));
  if (mm < 1 || mm > 12) return false;

  let currentYear = new Date().getFullYear() % 100;
  let currentMonth = new Date().getMonth() + 1;

  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return false;
  }
  return true;
}