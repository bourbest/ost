
db = connect('mongodb://localhost:27017/ost_dev')

accounts = db.UserAccount
accounts.deleteMany({})


// USER
user = {
  _id: 'testuser',
  username : "test@hotmail.com",
  passwordHash : "$2a$08$bbV50mrgutPUJ6enSySNjugeN7uvoBTwlxDv93dSPDVs6MPva5nxi", // test
  createdOn : ISODate("2020-02-22T00:25:08.184Z"),
  modifiedOn : ISODate("2020-02-22T00:25:08.184Z")
}
accounts.insertOne(user)

// Character
char = db.Character
char.deleteMany({})
char.insertOne({
  _id: 'testuser',
  name : "Balthazar le grand",
  xp: 500,
  availableGold: 1130,
  lifetimeEarnGold: 4000
})

// Scrolls
db.Scroll.deleteMany({})
db.Scroll.insertMany([
  {_id: 'scroll1', ownerId: 'testuser', usedOn: ISODate("2020-02-22T00:25:08.184Z"), xp: 10, gold: 0},
  {_id: 'scroll2', ownerId: 'testuser', usedOn: ISODate("2020-01-13T00:25:08.184Z"), xp: 4, gold: 100},
  {_id: 'scroll3', xp: 100, gold: 40}
])

// Invoice CLaims
db.InvoiceClaim.deleteMany({})
db.InvoiceClaim.insertMany([
  {_id: 'claim1', invoiceId: '123', invoiceDate: ISODate("2020-01-17T00:00:00.000Z"), invoiceTime: '11:43',
       ownerId: 'testuser', status: 'pending', createdOn: ISODate("2020-02-22T00:25:08.184Z"),
       invoiceEffectiveDate: ISODate("2020-01-17T00:00:00.000Z")
  },

  {_id: 'claim2', invoiceId: '124', invoiceDate: ISODate("2020-01-17T00:00:00.000Z"), invoiceTime: '11:43',
       ownerId: 'testuser', status: 'denied', createdOn: ISODate("2020-02-22T00:25:08.184Z"),
       invoiceEffectiveDate: ISODate("2020-01-17T00:00:00.000Z")
  },

  {_id: 'claim3', invoiceId: '125', invoiceDate: ISODate("2020-01-17T00:00:00.000Z"), invoiceTime: '11:44',
       ownerId: 'testuser', status: 'approved', createdOn: ISODate("2020-02-22T00:25:08.184Z"),
       invoiceEffectiveDate: ISODate("2020-01-17T00:00:00.000Z")} 
])

// Quests
db.Quests.deleteMany({})
db.Quests.insertMany([{
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
}])


// Perks
db.Perks.deleteMany({})
db.Perks.insertMany([{
  _id: 'a1',
  levelRequired: 1,
  name: 'Potatoes !',
  description: 'Panier de pétakes',
  cost: 100,
  imageURL: '/public/img01.jpg'
}, {
  _id: 'a2',
  levelRequired: 1,
  name: 'Pinte !',
  description: 'Pinte au choix',
  cost: 200,
  imageURL: '/public/img02.jpg'
}, {
  _id: 'a3',
  levelRequired: 1,
  name: 'Pinte !',
  description: 'Pinte au choix',
  cost: 200,
  imageURL: '/public/img02.jpg'
}, {
  _id: 'a4',
  levelRequired: 1,
  name: 'Pinte !',
  description: 'Pinte au choix',
  cost: 200,
  imageURL: '/public/img02.jpg'
}, {
  _id: 'b1',
  levelRequired: 2,
  name: 'Pinte !',
  description: 'Pinte au choix',
  cost: 200,
  imageURL: '/public/img02.jpg'
}, {
  _id: 'b2',
  levelRequired: 2,
  name: 'Pinte !',
  description: 'Pinte au choix',
  cost: 200,
  imageURL: '/public/img02.jpg'
}])

db.Staff.deleteMany({})
db.Staff.insertMany([{
  _id: 'steph',
  code: 'aaaa'
}
])