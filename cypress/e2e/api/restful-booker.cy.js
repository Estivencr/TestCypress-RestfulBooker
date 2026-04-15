describe('Restful Booker — CRUD completo', () => {

  const API = Cypress.env('restfulBookerUrl')
  const authHeader = {
    Authorization: 'Basic ' + btoa('admin:password123')
  }

  // ← variable compartida entre tests
  let bookingId

  it('POST /booking — debe crear reserva y devolver ID', () => {
    cy.fixture('restful-booker').then((data) => {
      cy.request({
        method: 'POST',
        url: `${API}/booking`,
        headers: { 'Content-Type': 'application/json' },
        body: data.reserva
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('bookingid')
        expect(response.body.booking.firstname).to.eq('Estiven')
        expect(response.body.booking.totalprice).to.eq(150)

        // ← guardar en la variable del describe
        bookingId = response.body.bookingid
        cy.log(`Reserva creada: ID ${bookingId}`)
      })
    })
  })

  it('GET /booking/:id — debe obtener la reserva creada', () => {
    cy.request({
      method: 'GET',
      url: `${API}/booking/${bookingId}`   // ← usar directamente
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.firstname).to.eq('Estiven')
      expect(response.body.lastname).to.eq('QA')
      expect(response.body.totalprice).to.eq(150)
    })
  })

  it('PUT /booking/:id — debe actualizar la reserva completa', () => {
    cy.fixture('restful-booker').then((data) => {
      cy.request({
        method: 'PUT',
        url: `${API}/booking/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: data.reservaActualizada
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.lastname).to.eq('QA Senior')
        expect(response.body.totalprice).to.eq(200)
      })
    })
  })

  it('PATCH /booking/:id — debe actualizar solo el precio', () => {
    cy.request({
      method: 'PATCH',
      url: `${API}/booking/${bookingId}`,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: { totalprice: 999 }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.totalprice).to.eq(999)
      expect(response.body.firstname).to.eq('Estiven')
    })
  })

  it('GET /booking/99999 — debe devolver 404', () => {
    cy.request({
      method: 'GET',
      url: `${API}/booking/99999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it('PUT sin auth — debe devolver 403', () => {
    cy.fixture('restful-booker').then((data) => {
      cy.request({
        method: 'PUT',
        url: `${API}/booking/${bookingId}`,
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
        body: data.reservaActualizada
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })
  })

  it('DELETE /booking/:id — debe eliminar la reserva', () => {
    cy.request({
      method: 'DELETE',
      url: `${API}/booking/${bookingId}`,
      headers: authHeader
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })

  it('GET después de DELETE — debe devolver 404', () => {
    cy.request({
      method: 'GET',
      url: `${API}/booking/${bookingId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

})