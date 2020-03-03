import React from "react"
import {Link} from 'react-router-dom'

// redux
import { connect } from 'react-redux'
import { getMyCharacter, getMyLevel, getNextLevelProgress } from '../../modules/character/selectors'

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

function HomePage(props) {
  const progressStyle = {
    width: `${props.nextLevelProgress.toPrecision(1)}%`
  }
  return (
    <div className="container">
      <h1>Bienvenue {props.character.name} !</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Sommaire</h5>
          <div className="card-text">
            <div>{props.currentLevel.label}</div>
            <div>Expérience
              <div className="progress">
                <div className="progress-bar" style={progressStyle} role="progressbar" aria-valuenow="345" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div>
              Or : {props.character.availableGold}
            </div>
          </div>
          <Link to="/xp/add-invoice" className="btn btn-primary">+XP</Link>
          <Link to="/xp/use-scroll" className="btn btn-primary">Parchemin</Link>
          <Link to="/perks/buy" className="btn btn-primary">Avantages</Link>
          <Link to="/my-perks" className="btn btn-primary">Mes avantages</Link>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    character: getMyCharacter(state),
    currentLevel: getMyLevel(state),
    nextLevelProgress: getNextLevelProgress(state)
  }
  return props
}

const ConnectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage)

export default ConnectedHomePage