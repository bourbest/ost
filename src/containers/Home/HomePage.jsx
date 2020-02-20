import React from "react"
import {Link} from 'react-router-dom'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getMyCharacter } from '../../modules/character/selectors'

const mapDispatchToProps = (dispatch) => {
  return {
  }
}


function HomePage(props) {
  return (
    <div className="container">
      <h1>Bienvenue {props.character.name} !</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Sommaire</h5>
          <div className="card-text">
            <div>Niveau 1</div>
            <div>Expérience
              <div className="progress">
                <div className="progress-bar" style={{width: '25%'}} role="progressbar" aria-valuenow="345" aria-valuemin="0" aria-valuemax="2500"></div>
              </div>
            </div>
            <div>
              Or : 405
            </div>
          </div>
          <Link to="/xp/add-invoice" className="btn btn-primary">+XP</Link>
          <Link to="/use-scroll" className="btn btn-primary">Parchemin</Link>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    character: getMyCharacter(state)
  }
  return props
}

const ConnectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage)

export default ConnectedHomePage