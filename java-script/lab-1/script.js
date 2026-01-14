"use strict"

const NAME = "Vitalii Skubach";
function logError() { console.error(NAME); }

const elements = document.getElementsByClassName("pretty"); // Get the list of elements.
const divElements = Array.from(elements).filter(
    element => element.nodeName === "DIV"
);

const element = divElements[0];

const heading = element.getElementsByClassName("heading")[0];

// element.addEventListener("mouseout", logError);
element.addEventListener("mouseout", (event) => {
    // event.stopImmediatePropagation();
    logError();
    heading.innerText = "Check Console for Errors.";
    event.target.style.background = "red"; // Елемент, який залишила миша.
    setTimeout(() => {
        event.target.style.background = "cyan";
    }, 500);
});

const button = document.querySelector("button");
button.addEventListener("click", buttonPress);

function buttonPress() {
    this.textContent = "Clicked! Also check console.";
    logError();
}

// globalThis.alert("Hello");

// DOM
// for(let i = 0; i < document.body.childNodes.length; i++) {
//     alert(document.body.childNodes[i]);
// }
    
// childNodes - колекція (ітеративний псевдомасив)
// for(let node of document.body.childNodes) {
//     alert(node);
// }

// children - лише елементи
// for(let node of document.body.children) {
//     alert(node);
// }

// parentNode, siblings
// alert(document.body.parentNode);
// alert(document.head.nextSibling);
// alert(document.body.previousSibling);
