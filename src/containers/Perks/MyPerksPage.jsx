import React, {useState} from "react"
import {map} from 'lodash'

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators as AppActions } from '../../modules/app/actions'
import { ActionCreators as CharacterActions } from '../../modules/character/actions'
import { getPerksById, getFormError } from '../../modules/app/selectors'
import { getMyPerkCountsByPerkId, USE_PERK_FORM_NAME } from '../../modules/character/selectors'

// components
import PerkCard from './components/PerkCard'
import InputStaffCodeModal from './components/InputStaffCodeModal'

const mapDispatchToProps = (dispatch) => {
  return {
    charActions: bindActionCreators(CharacterActions, dispatch),
    appActions: bindActionCreators(AppActions, dispatch),
  }
}

function MyPerksPage(props) {
  const {myPerkCountsByPerkId, perksById} = props
  const [selectedPerkId, setSelectedPerkId] = useState(null)

  const handleUse = function(event) {
    setSelectedPerkId(event.target.value)
  }
  const handleUseConfirmed = function (staffCode) {
    props.charActions.usePerk(selectedPerkId, staffCode, function () {
      setSelectedPerkId(null)
    })
  }

  const handleUseCancelled = function () {
    setSelectedPerkId(null)
  }

  return (
    <div className="container">
      <h1>Mes avantages</h1>
      <div className="d-flex flex-wrap" style={{justifyContent: 'space-around'}}>
      {map(myPerkCountsByPerkId, (count, perkId) => (
        <PerkCard perk={perksById[perkId]}
          buttonLabel="Utiliser"
          bought={count}
          key={perkId}
          className="card-front"
          onButtonClick={handleUse}
        />
      ))}
      {selectedPerkId &&
        <InputStaffCodeModal
          perk={perksById[selectedPerkId]}
          onCancel={handleUseCancelled}
          onConfirm={handleUseConfirmed}
          confirmError={props.usePerkError}
        />
      }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    myPerkCountsByPerkId: getMyPerkCountsByPerkId(state),
    perksById: getPerksById(state),
    usePerkError: getFormError(state, USE_PERK_FORM_NAME)
  }
  return props
}

const ConnectedMyPerksPage = connect(mapStateToProps, mapDispatchToProps)(MyPerksPage)

export default ConnectedMyPerksPage