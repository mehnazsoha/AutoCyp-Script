/// <reference types="Cypress"/>

const fake = require('faker');
const promisify = require('cypress-promise');

// Fake and random values
let lastName = fake.name.lastName()
let address = fake.address.streetAddress()
let city = fake.address.city()
let phoneNumber = `612212${Math.floor(Math.random() * (9999 - 1000) + 1000)}`
let ssn = `${Math.floor(Math.random() * (999999999 - 100000000) + 100000000)}`


describe('Sign up with valid information', () => {
    beforeEach(() => {
        cy.fixture("auth_data.json").then(function (authData) {
            this.authData = authData
        })
        cy.fixture("signup_data.json").then(function (signUpData) {
            this.signUpData = signUpData
        })
        cy.fixture("portalURL_data.json").then(function (portalData) {
            this.portalData = portalData
        })
        cy.fixture("locators_data.json").then(function (locatorData) {
            this.locatorData = locatorData
        })
    });

    it('Input user informations', async function () {
        cy.visit(this.portalData.dev.Midas, {
            auth: {
                username: this.authData.dev.username,
                password: this.authData.dev.password
            }
        })
        cy.get(this.locatorData.email).clear().type(this.signUpData.email)
        cy.get(this.locatorData.continue).click()
        cy.get(this.locatorData.countryDropDown).click()
        cy.get(this.locatorData.country).click()

        const country = await promisify(cy.get(this.locatorData.countryDropDown).then(el => el.text())) // To wait until get the text from the element

        cy.get(this.locatorData.firstName).clear().type(this.signUpData.firstName)
        cy.get(this.locatorData.lastName).clear().type(lastName)

        cy.get(this.locatorData.calendar).dblclick()
        cy.get(this.locatorData.yearField).click()
        cy.get(this.locatorData.year).click()
        cy.contains('OK').click()

        cy.get(this.locatorData.address1).clear().type(address)
        cy.get(this.locatorData.city).clear().type(city)

        if (country === 'Canada') {
            cy.get(this.locatorData.postCode).clear().type(this.signUpData.postCode)
        } else {
            let postCode;
            while (true) {
                const generatePostCode = fake.address.zipCode();
                if (generatePostCode.length === 5) {
                    postCode = generatePostCode;
                    break;
                }
            }
            cy.get(this.locatorData.postCode).clear().type(postCode)
        }

        if (country === 'United States of America') {
            cy.contains('Select').click()
            cy.get(this.locatorData.state).click()
            cy.get(this.locatorData.ssn).clear().type(ssn)
        }
// Need to select the 
        cy.get(this.locatorData.phoneNumber).clear().type(phoneNumber)
        cy.get(this.locatorData.password).clear().type(this.signUpData.password)
        cy.get(this.locatorData.confirmPassword).clear().type(this.signUpData.password)
        cy.get(this.locatorData.checkBox).check()
    });
});