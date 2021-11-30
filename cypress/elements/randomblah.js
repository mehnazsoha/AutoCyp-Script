const faker = require('faker');

let postCode;

while (true) {
    const generatePostCode = faker.address.zipCode();

    if (generatePostCode.length === 5) {
        postCode = generatePostCode;
        break;
    }
}

console.log(postCode);