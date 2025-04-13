const randomMonth = () => {
    return Math.floor(Math.random() * 12) + 1;
}

const randomDay = () => {
    return Math.floor(Math.random() * 31) + 1;
}

const randomYear = () => {
    return Math.floor(Math.random() * 10) + 2005;
}

const randomGender = () => {
    return Math.floor(Math.random() * 3) + 1;
}

export { randomMonth, randomDay, randomYear, randomGender };





