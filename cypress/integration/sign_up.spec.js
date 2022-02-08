/// <reference types="Cypress"/>

const fake = require('faker');
const promisify = require('cypress-promise');

// Fake and random values
let middleName = fake.name.firstName()
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
        cy.fixture("user_data.json").then(function (userData) {
            this.userData = userData
        })
        cy.fixture("portalURL_data.json").then(function (portalData) {
            this.portalData = portalData
        })
        cy.fixture("signup_locators_data.json").then(function (locatorData) {
            this.locatorData = locatorData
        })
    });

    it('Input user informations', async function () {
        const portal = this.portalData.dev
        const credentials = this.authData.dev
        const locator = this.locatorData
        const user = this.userData

        cy.visit(portal.PLCU, {
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        })

        cy.get(locator.email).clear().type(user.email)
        cy.get(locator.continue).click()
        cy.get(locator.countryDropDown).click()
        cy.get(locator.country).click()

        const country = await promisify(cy.get(locator.countryDropDown).then(el => el.text())) // Wait until get the text from the element

        cy.get(locator.firstName).clear().type(user.firstName)
        cy.get(locator.lastName).clear().type(middleName + " " + lastName)
        cy.get(locator.calendar).dblclick()
        cy.get(locator.yearField).click()
        cy.get(locator.year).click()
        cy.contains('OK').click()
        cy.get(locator.address1).clear().type(address)
        cy.get(locator.city).clear().type(city)

        if (country === 'Canada') {
            cy.get(locator.postCode).clear().type(user.postCode)
        } else {
            let postCode;
            while (true) {
                const generatePostCode = fake.address.zipCode();
                if (generatePostCode.length === 5 && generatePostCode[0] != 0) {
                    postCode = generatePostCode
                    break;
                }
            }
            cy.get(locator.postCode).clear().type(postCode)
        }

        if (country === 'United States of America') {
            cy.contains('Select').click()
            cy.get(locator.state).click()
            cy.get(locator.ssn).clear().type(ssn)
        } else {
            cy.get(locator.selectFlag).click()
            cy.get(locator.countryCode).click()
        }

        cy.get(locator.phoneNumber).clear().type(phoneNumber)
        cy.get(locator.password).clear().type(user.password)
        cy.get(locator.confirmPassword).clear().type(user.password)
        cy.get(locator.checkBox).check()
    });
});
