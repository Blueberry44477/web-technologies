"use strict"
// Завдання 1. Оператори порівняння.
function minMax(numbers) {
    if (!Array.isArray(numbers) || numbers.length === 0)
        throw new Error("Faulty input");

    let min = numbers[0];
    let max = numbers[0];

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] < min)
            min = numbers[i];

        if (numbers[i] > max)
            max = numbers[i];
    }

    return [min, max];
}

function areShallowEqual(obj1, obj2) {
    // Same object
    if (obj1 === obj2)
        return true;

    if (typeof obj1 !== "object" || obj1 === null ||
        typeof obj2 !== "object" || obj2 === null
    ) {
        return false;
    }

    // keys return an array consisting of the property names.
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length)
        return false;

    for (let key of keys1) {
        if (!Object.hasOwn(obj2, key) || obj1[key] !== obj2[key])
            return false;
    }

    return true;
}

function areDeepEqual(obj1, obj2) {
    if (obj1 === obj2)
        return true;

    if (typeof obj1 !== "object" || obj1 === null ||
        typeof obj2 !== "object" || obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length)
        return false;

    for (let key of keys1) {
        if (!keys2.includes(key))
            return false;

        if(!areDeepEqual(obj1[key], obj2[key]))
            return false;
    }
    return true;
}

// Завдання 2. Логічні оператори.
function isInRange(number, min, max) {
    if (typeof number !== "number")
        throw new Error("Not a number");
    return number >= min && number <= max;
}

function returnOpposite(value) {
    if (typeof value !== "boolean")
        throw new Error("Not boolean");
    return !value;
}

// const returnOpposite = value => !value;

// Завдання 3. Умовні розгалуження.
function getTextMark(number) {
    if (typeof number !== "number")
        throw new Error("Input is not a number");

    switch (number) {
        case 5:
            return "Відміннo";
        case 4:
            return "Добре";
        case 3:
            return "Задовільно";
        case 2:
            return "Незадовільно";
        case 1:
            return ":(";

        default:
            return "Невідома оцінка";
    }

    if (number === 5)
        return "Відміннo";
    else if (number === 4)
        return "Добре";
    else if (number === 3)   
        return "Задовільно";
    else if (number === 2)    
        return "Незадовільно";
    else if (number === 1)    
        return ":(";
    else
        return "Невідома оцінка";

    return number === 5 ? "Відміннo" :
           number === 4 ? "Добре" :
           number === 3 ? "Задовільно" :
           number === 2 ? "Незадовільно" :
           number === 1 ? ":(" : "Невідома оцінка";
}

function getSeasonString(monthNumber) {
    if (typeof monthNumber !== "number")
        throw new Error("Input is not a number");

    switch (monthNumber) {
        case 1:
        case 2:
        case 12:
            return "Зима";
        case 3:
        case 4:
        case 5:
            return "Весна";
        case 6:
        case 7:
        case 8:
            return "Літо";
        case 9:
        case 10:
        case 11:
            return "Осінь";

        default:
            return "Такого місяця не існує";
    }

    if (month >= 1 && month <= 12) {
        if (month === 12 || month === 1 || month === 2)
            return "Зима";
        else if (month >= 3 && month <= 5)
            return "Весна";
        else if (month >= 6 && month <= 8)
            return "Літо";
        else
            return "Осінь";
    } else {
        return "Такого місяця не існує";
    }

    return (month < 1 || month > 12) ? "Такого місяця не існує" :
           (month === 12 || month === 1 || month === 2) ? "Зима" :
           (month >= 3 && month <= 5) ? "Весна" :
           (month >= 6 && month <= 8) ? "Літо" :
                                        "Осінь";
}

// Test
console.log(minMax([1,2,3,4,5]));
console.log(getSeasonString(10));