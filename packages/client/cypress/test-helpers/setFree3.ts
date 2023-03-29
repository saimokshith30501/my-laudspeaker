import "@4tw/cypress-drag-drop";
/* eslint-disable jest/valid-expect */
export default () => {
  cy.get('[data-disclosure-link="Settings"] > .bg-amber-700').click();
  cy.get(".text-black").click();
  cy.get(".-mb-px > :nth-child(3)").click();
  cy.wait(1000);
  cy.contains("Free3").click();
  cy.contains("You need to verify your email!").should("exist");
  cy.request(`${Cypress.env("AxiosURL")}tests/test-verification`).then(
    ({ body }) => {
      expect(body.accountId).to.equal("00000000-0000-0000-0000-000000000000");
      expect(body.status).to.equal("sent");

      cy.request({
        url: `${Cypress.env("AxiosURL")}tests/verify-test-account/${body.id}`,
        method: "PATCH",
      }).then(() => {
        cy.reload();
        cy.wait(3000);
        cy.get(".-mb-px > :nth-child(3)").click();
        cy.wait(1000);

        cy.contains("Free3").click();
        cy.wait(1000);

        cy.get("#testSendingName").type("TestName");
        cy.get("#testSendingEmail").type("test-email");
        cy.contains("Save").click();

        cy.wait(1000);
        cy.reload();
        cy.get(".-mb-px > :nth-child(3)").click();
        cy.contains("Free3").click();

        cy.get("#testSendingName").should("have.value", "TestName");
        cy.get("#testSendingEmail").should("have.value", "test-email");
      });
    }
  );
};
