import {createBaseRepository} from './MongoRepository'

const CharacterPerksRepository = createBaseRepository('CharacterPerks')

CharacterPerksRepository.prototype.usePerk = function (boughtPerkId, usedOn, staffId) {
  const filters = {usedOn: null, _id: boughtPerkId}
  const update = {
    $set: {usedOn, validatedBy: staffId}
  }

  return this.collection.findOneAndUpdate(filters, update, {returnOriginal:false})
    .then(result => {
      return result.lastErrorObject.updatedExisting
    })
}

export default CharacterPerksRepository