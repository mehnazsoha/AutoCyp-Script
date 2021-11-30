/// <reference types="Cypress"/>

const {
    signupSelectors
} = require('../../elements/signup_selectors');

const fake = require('faker');

// Fake and random values
let lastName = fake.name.lastName()
let address = fake.address.streetAddress()
let city = fake.address.city()

let phoneNumber = `612212${Math.floor(Math.random() * (9999 - 1000) + 1000)}`


describe('Sign up with valid information', () => {
    let country

    // before(() => {
    //     cy.visit("https://member.dev.clubswan.com/", {
    //         auth: {
    //             username: 'devs',
    //             password: 'super!power'
    //         }
    //     })
    // });

    beforeEach(() => {
        cy.fixture("signup_data.json").then(function (data) {
            this.data = data
        })
    });

    it('Input user informations', function () {
        cy.visit("https://member.dev.clubswan.com/", {
            auth: {
                username: 'devs',
                password: 'super!power'
            }
        })
        cy.get("[id='email']").clear().type(this.data.email)
        cy.get("form button span:first-child").click()
        cy.get("[id='mui-component-select-country']").click()
        cy.get("li[data-value='CA']").click()

        cy.get("[id='mui-component-select-country']").then(($getText) => {
            country = $getText.text()
            cy.log(country)
        })

        

        cy.get("[name='firstName']").clear().type(this.data.firstName)
        cy.get("[name='lastName']").clear().type(lastName)
        cy.get("button[class='MuiButtonBase-root MuiIconButton-root']").dblclick().then(() => {
            cy.get("button[class='MuiButtonBase-root MuiButton-root MuiButton-text MuiPickersToolbarButton-toolbarBtn']:nth-child(1)").click()
            cy.get("div:nth-child(90)").click()
            cy.contains('OK').click()
        })
        cy.get("input[name='address1']").clear().type(address)
        cy.get("input[name='city']").clear().type(city)

        if (country === 'Canada') {
            cy.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> I am selecting this ")
            cy.get("input[name='postCode']").clear().type("T5J 3N6")
        } else {
            let postCode;
            while (true) {
                const generatePostCode = fake.address.zipCode();
                if (generatePostCode.length === 5) {
                    postCode = generatePostCode;
                    break;
                }
            }
            cy.log(postCode)
            cy.get("input[name='postCode']").clear().type(postCode)
        }

        // if (country === 'Bangladesh') {
        //     cy.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> I am here ")
        //     cy.contains('Select').click().then(() => {
        //         cy.get("li[data-value='Alabama']").click()
        //     })
        // }

        cy.get(".tel-input.form-control").clear().type(phoneNumber)
        cy.get("[name='password']").clear().type(this.data.password)
        cy.get("[name='confirmPassword']").clear().type(this.data.password)
        cy.get("[type='checkbox']").check()
    });
});