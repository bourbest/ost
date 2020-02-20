import {createBaseRepository} from './MongoRepository'

const UserAccountRepository = createBaseRepository('UserAccount')

UserAccountRepository.prototype.findByUsername = function (username) {
  const filters = {username}
  return this.collection.findOne(filters)
    .then(this.convertFromDatabase)
}

export default UserAccountRepository
