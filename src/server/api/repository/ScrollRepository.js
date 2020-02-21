import {createBaseRepository} from './MongoRepository'

const ScrollRepository = createBaseRepository('Scroll')

ScrollRepository.prototype.assignScrollToUser = function (scrollId, userId, usedOn) {
  const filters = {_id: scrollId, ownerId: null}
  const update = {
    $set: {ownerId: userId, usedOn}
  }

  return this.collection.findOneAndUpdate(filters, update, {returnOriginal:false})
    .then(result => {
      return result.value
    })
}

export default ScrollRepository