"use strict"

// Task 1.
let fruits = ["apple", "banana", "pear", "strawberry", "blueberry"]; 
console.log(fruits);
// 1.
fruits.pop();
console.log(fruits);
// 2.
fruits.unshift("pineapple");
console.log(fruits);
// 3.
fruits.reverse(); 
console.log(fruits);
// 4.
console.log("Apple index: " + fruits.findIndex( (str) => str === "apple")); // 4.

// Task 2. Colors.
console.log("Task 2");
let colors = ["blue", "yellow", "pink"];
// const shortestColor = colors.reduce((prev, curr) => prev.length <= curr.length ? prev : curr);
// const longestColor = colors.reduce((prev, curr) => prev.length >= curr.length ? prev : curr);

const result = colors.reduce((acc, curr) => {
    if (curr.length <= acc.shortest.length)
        acc.shortest = curr;
    if (curr.length >= acc.longest.length)
        acc.longest = curr;
    return acc;
}, {shortest: colors[0], longest: colors[0]});
console.log("Shortest color: " + result.shortest);
console.log("Longest color: " + result.longest);