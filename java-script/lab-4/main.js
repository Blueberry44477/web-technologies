"use strict"

/////////////
// Task 1. //
/////////////

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
console.log("Apple index: " + fruits.findIndex((str) => str === "apple")); // 4.

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
    new Employee("Andriy", 20, "Software Engineer"),
    new Employee("Kateryna", 17, "Barista")
];
console.log(employees);

// 2.
let sortedEmployees = employees.toSorted((a, b) => a.name.localeCompare(b.name));

// 3.
let softwareEngineers = employees.filter(obj => obj.profession.includes("Software Engineer"));

const keywords = ["Software Engineer", "Developer", "Programmer"];
let softwareEngineers2 = employees.filter(obj => 
    keywords.some(word => obj.profession.includes(word))
);

console.log(softwareEngineers);

// 4.
const index = employees.findIndex(emp => emp.age < 18);
if (index !== -1) {
    console.log(employees.at(index));
    employees.splice(index, 1);
}

// 5.
employees.push(new Employee("Vitalii", 18, "Software Engineer"));
employees.splice(1, 0, new Employee("Olena", 24, "QA"));
console.log(employees);

/////////////
// Task 4. //
/////////////

// 1.
class Student {
    constructor(name, age, course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }
};

const students = [
    new Student("Oleksiy", 20, 4),
    new Student("Bogdan", 17, 1),
    new Student("Bogdan2", 19, 3)
];

// 2.
const updatedStudents = students.filter(student => student.name !== "Oleksiy");
console.log(updatedStudents);

const studentIndex = students.findIndex(student => student.name === "Oleksiy");
if (index !== -1) {
    console.log(students.at(studentIndex));
    students.splice(studentIndex, 1);
}
console.log(students);

// 3.
students.push(new Student("Vlad", 18, 2));

// 4.
students.sort((a, b) => a.age - b.age);
console.log(students);

// 5.
const thirdDegreeStudent = students.find(student => student.course === 3);
console.log(thirdDegreeStudent);

/////////////
// Task 5. //
/////////////




