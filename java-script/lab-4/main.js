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

// 1.
const numbers = [];
for (let i = 1; i <= 10; i++) {
    numbers.push(i);
}
console.log(numbers);

const squaredNumbers = numbers.map(number => number ** 2);
console.log(squaredNumbers);

// 2. 
const evenNumbers = numbers.filter(number => number % 2 === 0);
console.log("5.2 - Even numbers: " + evenNumbers);

// 3.
const sum = numbers.reduce((a, b) => a + b);
console.log(`5.3 - Numbers sum: ${sum}`);

// 4.
const additionalNumbers = [20, 30, 40];
const concatenatedNumbers = numbers.concat(additionalNumbers);

console.log(`5.4 
numbers: ${numbers}
additionalNumbers: ${additionalNumbers}
numbers.concat(additionalNumbers): ${concatenatedNumbers}
`);

// 5.
numbers.splice(0, 3);
console.log(`5.4 - Numbers: ${numbers}`);

/////////////
// Task 6. //
/////////////
class Book {
    #title = "";
    #author = "";
    #genre = "";
    #pages = 0;
    #isAvailable = true;

    constructor(title, author, genre, pages, isAvailable) {
        this.#title = title;
        this.#author = author;
        this.#genre = genre;
        this.#pages = pages;
        this.#isAvailable = isAvailable;
    }

    get title() { return this.#title; }
    get author() { return this.#author; }
    get genre() { return this.#genre; }
    get pages() { return this.#pages; }
    get isAvailable() { return this.#isAvailable; }

    set isAvailable(status) {
        if (typeof status === "boolean") {
            this.#isAvailable = status;
        }
    }

    getInfo() {
        return `"${this.#title}" - ${this.#author} (${this.#pages} ст.)`;
    }
};

class Library {
    #books = []

    constructor(books = []) {
        this.#books = books;
    }

    get books() { return [...this.#books]; }

    add(book) {
        this.#books.push(book);
    }

    remove(title) {
        this.#books = this.#books.filter(book => book.title !== title);
    }

}

class LibraryManager {
    #library;
    constructor(library) {
        this.#library = library;
    }

    addBook(title, author, genre, pages) {
        const existingBooks = this.#library.books;
        const isDuplicate = existingBooks.some(b => b.title === title);
        
        if (isDuplicate)
            throw new Error(`Book "${title}" already exists.`);

        this.#library.add(new Book(title, author, genre, pages));
    }

    removeBook(title) {
        const bookExists = this.#library.books.some(book => book.title === title);
        if (!bookExists)
            throw new Error(`Book ${title} does not exist.`);

        this.#library.remove(title);
    }

    findBooksByAuthor(author) {
        const allBooks = this.#library.books;

        return allBooks.filter(book => 
            book.author.toLowerCase() === author.toLowerCase().trim()
        );
    }

    toggleBookAvailability(title, isBorrowed) {
        const book = this.#library.books.find(
            b => b.title.toLowerCase() === title.toLowerCase().trim()
        );

        if (!book)
            throw new Error(`Book "${title}" is not found.`);

        book.isAvailable = !isBorrowed;
    }

    sortBooksByPages() {
        return this.#library.books.toSorted((a, b) => a.pages - b.pages);
    }

    getBooksStatistics() {
        const allBooks = this.#library.books;
        const total = allBooks.length;

        if (total === 0) 
            throw new Error("No books available.");

        const available = allBooks.filter(book => book.isAvailable).length;
        const borrowed = total - available;
        const totalPages = allBooks.reduce((sum, book) => sum + book.pages, 0);
        const average = Math.round(totalPages / total);

        return {
            totalBooks: total,
            availableBooks: available,
            borrowedBooks: borrowed,
            averagePages: average
        };
    }
}

/////////////
// Task 7. //
/////////////

let student = {
    name: "John",
    age: 20,
    course: 2
};

student.lessons = ["Math", "Philosophy"];
delete student["age"];
console.log(student);