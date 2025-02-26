describe('Pacbio library creation from sample', () => {
  beforeEach(() => {
    cy.withFlags({
      dpl_277_disable_pacbio_specific_reception: { enabled: false },
    })
  })

  it('Visits the pacbio samples url', () => {
    cy.intercept('/v1/pacbio/requests', {
      fixture: 'tractionPacbioSamples.json',
    })
    cy.intercept('/v1/tags', {
      fixture: 'tractionTags.json',
    })
    cy.intercept('/v1/pacbio/pools?include=tube', {
      fixture: 'tractionPacbioPool.json',
    })
    cy.visit('#/pacbio/samples')
    cy.get('#samples-table').contains('td', '5')
    cy.get('#samples-table').first().click()
    cy.get('#pacbioLibraryCreate').click()
    cy.get('#tag-input').select('bc1001_BAK8A_OA')
    cy.get('#library-volume').type(1)
    cy.get('#library-concentration').type(1)
    cy.get('#library-templatePrepKitBoxBarcode').type('012345678901234567890')
    cy.get('#library-insertSize').type(1)
    cy.get('#create-btn').click()
    cy.contains('Created library with barcode TRAC-2-1465')
  })
})
