let Base_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const fromCurr=document.querySelector(".from select");
const toCurr=document.querySelector(".to select");
const btn=document.querySelector("form button");
let msg=document.querySelector(".msg");

for( let select of dropdowns){ //appending the list of countries in the select dropdown
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText= currCode;
        newOption.value=currCode;
        if(select.name === "from"){
        select.value ="USD";        }
        else if(select.name === "to"){
            select.value ="INR";
        }
        select.append(newOption);
        select.addEventListener("change",(evt)=>{
            updateFlag(evt.target);
        })
    }
}

const updateFlag= (event)=>{
    let currCode=event.value;
    let Code=countryList[currCode];
    let newSrc= `https://flagsapi.com/${Code}/flat/64.png`;
    let img= event.parentElement.querySelector("img");
    img.src= newSrc;
};

btn.addEventListener("click",async(evt)=>{
    evt.preventDefault();
    let amount= document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal ===""|| amtVal <0){
        amtVal = 0;
        amount.value="0";
    }

    const URL = `${Base_URL}/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data=await response.json();
    let rate= data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    let finalAmount = amtVal *rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
});


