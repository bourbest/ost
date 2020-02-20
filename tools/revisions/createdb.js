// const {createRevision} = require('./common')

/*
const bcrypt = require('bcryptjs')
const fs = require('fs')

function createAdminUser () {
  return bcrypt.hash('admin', 8)
    .then(passwordHash => {
      return {
        username: 'admin',
        passwordHash,
        fullName: 'Administrateur',
        firstName: 'Administrateur',
        lastName: 'admin',
        isArchived: false,
        createdOn: new Date(),
        modifiedOn: new Date()
      }
  })
}

function initializeAdminUser (db) {
  console.log('initializing admin')
  const users = db.collection('UserAccount')
  const filters = {username: 'admin'}
  return users.findOne(filters).then(user => {
      if (!user) {
        console.log('creating user')
        return createAdminUser()
          .then(user => users.insertOne(user))
      } else {
        console.log('user already exists')
      }
    })
    .then(() => {
      console.log('initializeAdminUser done')
      return db
    })
}
*/

function createIndexes (db) {
  console.log('creating index')
  const promises = [
    db.createIndex('UserAccount', 'username', {unique: true})
  ]

  return Promise.all(promises)
    .then(() => {
      console.log('createIndexes done')
      return db
    })
}

module.exports = function (db) {
  console.log('*********** Initial creation *************')
  return createIndexes(db)
    // .then(createRevision(1, 'Initial creation'))
    .then(() => {
      console.log('--------- Initial creation completed ---------------')
      return db
    })
}
