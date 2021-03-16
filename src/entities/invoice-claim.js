export const CLAIM_DENIAL_REASONS = {
  notFound: 'Le numéro de facture est erroné.',
  alreadyClaimedByUser: 'Vous avez déjà enregistré cette facture.',
  alreadyClaimed: 'Cette facture a déjà été enregistrée par une autre personne.',
  infoMismatch: 'Le numéro de facture et la date ou l\'heure ne correspondent pas.',
  limitReached: 'Vous ne pouvez enregistrer que deux factures pour une même journée.'
}

/* schéma
{ "_id" : "5fnVYm9OU", // id généré par le système
  "invoiceId" : "259197-1", // numéro inscrit sur la facture. doit correspondre à ce qui est loadé par l'admin
  "invoiceTime" : "13:03",  // heure inscrite sur la facture. doit également correspondre
  "invoiceDate" : ISODate("2020-02-16T00:00:00Z"), // date inscrite sur la facture. Doit également correspondre
  "ownerId" : "testuser",  // id du client qui a créé le claim
  "status" : "denied",  // statut du claim (pending, approved, denied)
  "createdOn" : ISODate("2020-03-22T12:33:17.705Z"), // date de création du claim
  "modifiedOn" : ISODate("2020-03-22T12:33:18.452Z"), // date de modification du claim
  "invoiceEffectiveDate" : ISODate("2020-02-16T00:00:00Z"), // date d'effectivité la limite du nombre de facture par jour
  "reason" : "Le numéro de facture et la date ou l'heure ne correspondent pas." // raison de rejet
 }
*/

// this will link the invoice to the claim's owner if the claim is valid
// otherwise, it will deny the claim and add the reason why
// note that the claim won't be denied if it is for an invoice whose date is > youngestInvoiceDate
// the function returns true if the claim was valid
export function validateClaim (invoicesById, claim, youngestInvoiceDate, userClaimedInvoicesForSameDay) {
  const invoice = invoicesById[claim.invoiceId]
  if (userClaimedInvoicesForSameDay.length >= 2) {
    claim.status = 'denied'
    claim.reason = CLAIM_DENIAL_REASONS.limitReached
  } else if (!invoice) {
    if (claim.invoiceDate <= youngestInvoiceDate) {
      claim.status = 'denied'
      claim.reason = CLAIM_DENIAL_REASONS.notFound
    }
  } else {
    if (invoice.claimedBy) {
      claim.status = 'denied'
      if (claim.ownerId === invoice.claimedBy) {
        claim.reason = CLAIM_DENIAL_REASONS.alreadyClaimedByUser
      } else {
        claim.reason = CLAIM_DENIAL_REASONS.alreadyClaimed
      }
    } else if (invoice.date.getDate() !== claim.invoiceDate.getDate() || invoice.time !== claim.invoiceTime) {
      claim.status = 'denied'
      claim.reason = CLAIM_DENIAL_REASONS.infoMismatch
    } else {
      invoice.claimedBy = claim.ownerId
      claim.status = 'approved'
    }
  }
  return claim.status === 'approved'
}