let Base_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

let msg = document.querySelector(".msg");
let form = document.querySelector("form");
let amountInput = document.querySelector(".amount input");

let fromSelectBox = document.querySelector("#fromSelect");
let toSelectBox = document.querySelector("#toSelect");

let swapBtn = document.querySelector(".fa-right-left");

// ✅ Dark mode toggle
let themeBtn = document.querySelector(".theme-btn");
let themeIcon = themeBtn.querySelector("i");

// Load saved theme
let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

// Toggle theme
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  }
});

let fromCurrency = "USD";
let toCurrency = "INR";

// ✅ Create Dropdown Options (Flags + Currency code)
function createOptions(selectBox, type) {
  let optionsContainer = selectBox.querySelector(".options");

  for (let currCode in countryList) {
    let countryCode = countryList[currCode];
    let flagSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let div = document.createElement("div");
    div.classList.add("option");
    div.innerHTML = `
      <img src="${flagSrc}" />
      <span>${currCode}</span>
    `;

    div.addEventListener("click", () => {
      // ✅ update dropdown selected UI
      selectBox.querySelector(".selected img").src = flagSrc;
      selectBox.querySelector(".selected .code").innerText = currCode;

      // ✅ update selected currency variables
      if (type === "from") fromCurrency = currCode;
      else toCurrency = currCode;

      // close dropdown
      optionsContainer.classList.add("hidden");
    });

    optionsContainer.append(div);
  }
}

// ✅ open/close dropdown
function setupDropdown(selectBox) {
  let selected = selectBox.querySelector(".selected");
  let options = selectBox.querySelector(".options");

  selected.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });
}

// ✅ Close dropdown if click outside
window.addEventListener("click", (e) => {
  if (!e.target.closest("#fromSelect")) {
    fromSelectBox.querySelector(".options").classList.add("hidden");
  }
  if (!e.target.closest("#toSelect")) {
    toSelectBox.querySelector(".options").classList.add("hidden");
  }
});

// ✅ Setup both dropdowns
createOptions(fromSelectBox, "from");
createOptions(toSelectBox, "to");
setupDropdown(fromSelectBox);
setupDropdown(toSelectBox);

// ✅ Swap button functionality
swapBtn.addEventListener("click", () => {
  // swap currency variables
  let temp = fromCurrency;
  fromCurrency = toCurrency;
  toCurrency = temp;

  // swap UI text codes
  let fromCode = fromSelectBox.querySelector(".selected .code");
  let toCode = toSelectBox.querySelector(".selected .code");

  let tempCode = fromCode.innerText;
  fromCode.innerText = toCode.innerText;
  toCode.innerText = tempCode;

  // swap flags
  let fromFlag = fromSelectBox.querySelector(".selected img");
  let toFlag = toSelectBox.querySelector(".selected img");

  let tempSrc = fromFlag.src;
  fromFlag.src = toFlag.src;
  toFlag.src = tempSrc;

  // auto convert after swapping
  form.dispatchEvent(new Event("submit"));
});

// ✅ Currency conversion
form.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  let amtVal = amountInput.value;

  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const URL = `${Base_URL}/${fromCurrency.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    let rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
  } catch (err) {
    msg.innerText = "❌ Error fetching data. Try again!";
    console.log(err);
  }
});
