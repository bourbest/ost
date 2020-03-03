
/*
{
  _id: 'quete1',
  name: 'Terrassez le minotaure',
  description: 'Venez manger le minotaure',
  xpEffect: {
    add: 100,
    multiply: 2
  },
  goldEffect: {
    add: 50,
    multiply: 1
  },
  validFrom: ISODate("2020-01-17T00:00:00.000Z"),  // invoice date / time UTC, convert to local time (-5h)
  validUntil: ISODate("2020-10-17T00:00:00.000Z"), // invoice date / time UTC
  successConditions: {
    minCost: 5.00,
    contains: ['Punch 1']
  }
}

invoice
{
  id: '3423',
  claimedBy: null,
  payment: 'VISA',
  
}
*/
export function findMatchingQuestsForInvoice (invoice, quests) {

}