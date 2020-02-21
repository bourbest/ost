import {createBaseRepository} from './MongoRepository'

const CharacterRepository = createBaseRepository('Character')

CharacterRepository.prototype.addXpAndGold = function (id, xpIncrement, goldIncrement, modifiedOn) {
  const filters = {_id: id}
  const update = {
    $inc: {availableGold: goldIncrement, lifetimeEarnedGold: goldIncrement, xp: xpIncrement},
    $set: {modifiedOn}
  }

  return this.collection.findOneAndUpdate(filters, update, {returnOriginal:false})
    .then(result => {
      return result.value
    })
}

export default CharacterRepository
