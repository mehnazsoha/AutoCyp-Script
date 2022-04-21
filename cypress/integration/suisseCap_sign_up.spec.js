/// <reference types="Cypress"/>

const fake = require('faker');

// Fake and random values
let lastName = fake.name.lastName()
let address = fake.address.streetAddress()
let city = fake.address.city()
let phoneNumber = `612212${Math.floor(Math.random() * (9999 - 1000) + 1000)}`
let ssn = `${Math.floor(Math.random() * (999999999 - 100000000) + 100000000)}`

describe('Sign up with valid information', () => {
    beforeEach(() => {
        // cy.exec('npm cache clear --force')
        cy.fixture("auth_data.json").then(function (authData) {
            this.authData = authData
        })
        cy.fixture("user_data.json").then(function (userData) {
            this.userData = userData
        })
        cy.fixture("portalURL_data.json").then(function (portalData) {
            this.portalData = portalData
        })
        cy.fixture("suisseCap_signup_locators_data.json").then(function (locatorData) {
            this.locatorData = locatorData
        })
    });

    it('Input user informations', function () {
        const portal = this.portalData.dev
        const credentials = this.authData.dev
        const locator = this.locatorData
        const user = this.userData

        cy.visit(portal.SuisseCap, {
            failOnStatusCode: false,
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        })
        cy.get(locator.firstName).clear().type(user.firstName)
        cy.get(locator.lastName).clear().type(lastName)
        cy.get(locator.DOB).clear().type(user.DOB)
        cy.get(locator.select).select(user.country)
        cy.get(locator.address1).clear().type(address)
        cy.get(locator.city).clear().type(city)

        if (user.country === 'CA') {
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

        cy.get(locator.email).clear().type(user.email)
        if (user.country === 'US') {
            cy.get(locator.ssn).clear().type(ssn)
            cy.get(locator.select).select(user.state, {
                force: true
            })
        } else {
            cy.get(locator.selectFlag).click()
            cy.get(locator.countryCode).click()
        }

        cy.get(locator.phoneNumber).clear().type(phoneNumber)
        cy.get(locator.password).clear().type(user.password)
        cy.get(locator.confirmPassword).clear().type(user.password)
        cy.get(locator.checkBox).check({
            force: true
        })
    })
})