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

/////////////////////
// Task 2. Colors. //
/////////////////////

console.log("Task 2");
// 1.
let colors = ["blue", "yellow", "pink", "light blue"];

// 2.
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

// 3.
const blueColors = colors.filter(item => item.includes("blue")); // Case sensitive.
const blueColors2 = colors.filter(item => item.toLowerCase().includes("blue")) // Case insensitive.

const regex = /blue/i
const blueColors3 = colors.filter(item => regex.test(item)); 

// 4.
console.log(blueColors.join(", "));

////////////
// Task 3 //
////////////
class Employee {
    constructor(name, age, profession) {
        this.name = name;
        this.age = age;
        this.profession = profession;
    }
}
// 1.
let employees = [
    new Employee("Bogdan", 19, "Brewer"), 
    new Employee("Andriy", 20, "Software Engineer")
];
console.log(employees);

// 2.
let sortedEmployees = employees.toSorted((a, b) => a.name.localeCompare(b.name));

let softwareEngineers = employees.filter(obj => obj.profession.includes("Software Engineer"));

const keywords = ["Software Engineer", "Developer", "Programmer"];
let softwareEngineers2 = employees.filter(obj => 
    keywords.some(word => obj.profession.includes(word))
);

console.log(softwareEngineers);

// 3.