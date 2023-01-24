'use strict';

export function passwordGenerator(length) {
    let password = '';
    const capitalChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const cyrilicChars = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const numbers = '1234567890';

    const cyrilicCharactersLength = cyrilicChars.length;
    password += cyrilicChars.charAt(Math.floor(Math.random() * cyrilicCharactersLength));

    const numbersLength = numbers.length;
    password += numbers.charAt(Math.floor(Math.random() * numbersLength));

    const latinCharactersLength = capitalChars.length;
    password += capitalChars.charAt(Math.floor(Math.random() * latinCharactersLength));

    password += textGenerator(length - 3);
    return password;
}

export function emailGenerator(length, password) {
    let email = password[password.length-1];
    email += textGenerator(length - 1);
    return email;
}

export function textGenerator(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomIntsInRange(amount, max, selectAllIndex) {
    let arr = [];
    while (arr.length < amount) {
        let r = Math.floor(Math.random() * max);
        if (arr.indexOf(r) === -1 && r !== selectAllIndex) {
            arr.push(r);
        }
    }
    return arr;
}

export function findIndexByText(arr) {
    return arr.indexOf('Select all');
}

export function stringContainsValue(str, value) {
    return str.includes(value);
}

export function convertTimeout(str) {
    str = str.slice(0, -1);
    str = str.concat('000');
    return parseInt(str);
}
