"use strict"

// 1.
function fibonacci(limit) {
    if (typeof limit !== "number")
        throw new Error("Input is not a number");

    let count = 0;
    let sum = 0;
    let a = 0;
    let b = 1;

    while(count < limit) {
        sum += a;
        
        let next = a + b;
        a = b;
        b = next;
        
        count++;
    }
    return sum;
}

// 2.
function getSum(number) {
    if (typeof number !== "number")
        throw new Error("Input is not a number");
    
    for (let i = 0; i < number; i++) {
        sum += i;
    }

    return sum;
}

// 3.
function getDayStr(number) {
    if (typeof number !== "number")
        throw new Error("Input is not a number");

    switch (number) {
        case 1:
            return "Mon";
        case 2:
            return "Tue";
        case 3:
            return "Wed";
        case 4:
            return "Thur";
        case 5:
            return "Fr";
        case 6:
            return "Sat";
        case 7:
            return "Sun";

        default:
            return "Unknown Day";
    }
}

// 4.
function getOddStrings(array) {
    let oddStrings = []
    array.forEach(element => {
        if (element % 2 !== 0)
            oddStrings.push(element);
    });
    return oddStrings;
}

// function getOddStrings(array) {
//     return array.filter((element) => element % 2 !== 0);
// }

// 5.
let array = [1, 2, 3];
console.log(`Array: ${array}`);

// Change in-place.
// let addByOne = (array) => array.forEach((element, index) => array[index] = element + 1);
// addByOne(array);
// console.log(array);

// Return new arr.
let addByOne = (array) => array.map((element) => element + 1); 
let newArr = addByOne(array);
console.log(`New array: ${newArr}`);

// let addByOne = (array) => array.forEach((element) => element += 1); // element is passed by value, so original array does not change. 
// Also forEach returns nothing.

// 6.
function isTen(a, b) {
    return ((a + b) === 10) || ((a - b) === 10);
}

// Test.
let limit = 10;
let fibonacciSum = fibonacci(limit);
console.log(fibonacciSum);