describe('Bryan Portfolio', () => {
  it('loads the home page', () => {
    cy.visit('http://localhost:5173')

    cy.contains('Bryan Senfuma').should('be.visible')
  })
})

it('uses AI to test the About page', () => {
  cy.prompt([
    'visit http://localhost:5173/',
    'click the About link in the navigation',
    'verify "Making complex technology easier to trust." is visible'
  ])
})