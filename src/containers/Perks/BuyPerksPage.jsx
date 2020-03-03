import React from "react"
import {map} from 'lodash'

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as CharacterActions } from '../../modules/character/actions'
import { getPerksByLevel } from '../../modules/app/selectors'
import { canBuyPerkById, getMyPerkCountsByPerkId } from '../../modules/character/selectors'
import {LEVELS} from '../../data/levels'

// components
import PerkCard from './components/PerkCard'

const mapDispatchToProps = (dispatch) => {
  return {
    charActions: bindActionCreators(CharacterActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
  }
}

function BuyPerksPage(props) {
  const {perksByLevel, enableBuyPerPerkId, perksCountById} = props

  const handleBuy = function(event) {
    props.charActions.buyPerk(event.target.value)
  }

  return (
    <div className="container">
      <h1>Acheter des avantages</h1>
      {map(LEVELS, level => {
        if (perksByLevel[level.id].length === 0) return null
        return (
          <div key={level.id}>
            <h4>{level.label}</h4>
            <div className="d-flex flex-wrap" style={{justifyContent: 'space-around'}}>
              {map(perksByLevel[level.id], perk => (
                <PerkCard perk={perk}
                  bought={perksCountById[perk.id]}
                  buttonLabel={perk.cost.toString()}
                  disableButton={!enableBuyPerPerkId[perk.id]}
                  key={perk.id}
                  className="mr-2 mb-2"
                  onButtonClick={handleBuy} />
                ))}
            </div>
          </div>
      )})}
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    perksByLevel: getPerksByLevel(state),
    enableBuyPerPerkId: canBuyPerkById(state),
    perksCountById: getMyPerkCountsByPerkId(state)
  }
  return props
}

const ConnectedBuyPerksPage = connect(mapStateToProps, mapDispatchToProps)(BuyPerksPage)

export default ConnectedBuyPerksPage