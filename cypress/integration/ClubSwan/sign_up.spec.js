/// <reference types="Cypress"/>

const fake = require('faker');


let lastName = fake.name.lastName()
let address = fake.address.streetAddress()
let city = fake.address.city()
let postCode = () => {
    let generatePostCode = fake.address.zipCode()
    if (generatePostCode.length === 5) return generatePostCode
    postCode()
}
let phoneNumber = `612${Math.floor(Math.random() * (9999999 - 1000000) + 1000000)}`

describe('Sign up successfully', () => {
    before(() => {
        cy.visit("https://dev.midas.clubswan.com/", {
            auth: {
                username: 'devs',
                password: 'super!power'
            }
        })
    });

    beforeEach(() => {
        cy.fixture("signup_data.json").then(function (data) {
            this.data = data
        })
    });

    it.only('Input user informations', function () {
        cy.get("[id='email']").clear().type(this.data.email)
        cy.get("form button span:first-child").click()
        cy.get("[id='mui-component-select-country']").click()
        cy.get("li[data-value='CA']").click()
        cy.get("[name='firstName']").clear().type(this.data.firstName)
        cy.get("[name='lastName']").clear().type(lastName)
        cy.get("button[class='MuiButtonBase-root MuiIconButton-root']").dblclick().then(() => {
            cy.get("button[class='MuiButtonBase-root MuiButton-root MuiButton-text MuiPickersToolbarButton-toolbarBtn']:nth-child(1)").click()
            cy.get("div:nth-child(90)").click()
            cy.contains('OK').click()
        })
        cy.get("input[name='address1']").clear().type(address)
        cy.get("input[name='city']").clear().type(city)

        cy.get("[id='mui-component-select-country']").then(($getText) => {
            let country = $getText.text()
            cy.log(country)
            if (country === 'Canada') {
                cy.get("input[name='postCode']").clear().type("T5J 3N6")
            } else {
                cy.get("input[name='postCode']").clear().type(postCode())
            }
        })
        cy.get(".tel-input.form-control").clear().type(phoneNumber)
        cy.get("[name='password']").clear().type(this.data.password)
        cy.get("[name='confirmPassword']").clear().type(this.data.password)
        cy.get("[type='checkbox']").check()
    });
});