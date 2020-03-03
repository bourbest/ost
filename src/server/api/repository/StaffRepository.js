import {createBaseRepository} from './MongoRepository'

const StaffRepository = createBaseRepository('Staff')

StaffRepository.prototype.findByCode = function (code) {
  const filters = {code}
  return this.collection.findOne(filters)
    .then(this.convertFromDatabase)
}

export default StaffRepository