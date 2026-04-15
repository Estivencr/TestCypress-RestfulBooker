const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
    defaultCommandTimeout: 8000,
    specPattern: 'cypress/e2e/**/*.cy.js',
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      restfulBookerUrl: process.env.RESTFUL_BOOKER_URL || 'https://restful-booker.herokuapp.com',
      adminUser: process.env.ADMIN_USER || 'admin',
      adminPassword: process.env.ADMIN_PASSWORD || 'password123'
    },
    setupNodeEvents(on, config) {}
  }
})
