/// <reference types="Cypress"/>

describe('Successfully completed the payment procedure', () => {
    beforeEach(() => {
        cy.fixture("portalURL_data.json").then(function (portalData) {
            this.portalData = portalData
        })
        cy.fixture("auth_data.json").then(function (authData) {
            this.authData = authData
        })
        cy.fixture("user_data.json").then(function (userData) {
            this.userData = userData
        })
        cy.fixture("plan_purchase_data.json").then(function (locatorData) {
            this.locatorData = locatorData
        })
    })

    it('Select the plan', async function () {
        const portal = this.portalData.dev
        const credentials = this.authData.dev
        const user = this.userData
        const locator = this.locatorData

        cy.visit(portal.PlatinCoin, {
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        })
        cy.get(locator.email).clear().type(user.email)
        cy.get(locator.continue).click()
        cy.get(locator.password).clear().type(user.password)
        cy.get(locator.continue).click()
        cy.contains('Get Midas').click()
        cy.get(locator.cardContinue).click()
        cy.get(locator.paymentDropDown).click()
        cy.get(locator.paymentMethod).click()
    })
})