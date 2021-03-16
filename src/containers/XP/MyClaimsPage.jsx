import React, {useEffect} from "react"

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMyClaimsByDate } from '../../modules/character/selectors'
import {ActionCreators as CharActions} from '../../modules/character/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    charActions: bindActionCreators(CharActions, dispatch)
  }
}

function printStatus (status) {
  switch (status) {
    case 'pending': return 'En attente'
    case 'approved': return <span className="badge badge-success">Approuvé</span>
    case 'denied': return <span className="badge badge-danger">Refusé</span>
    default:
      throw new Error('Unexpected status')
  }
}

function MyClaimsPage(props) {
  useEffect( () => {props.charActions.refreshClaims()}, [props.charActions])
  const claims = props.claims
  return (
    <div className="container">
      <h1>Mes factures enregistrées</h1>
      <table className="table">
        <thead>
          <tr>
            <th>No facture</th>
            <th>Date facture</th>
            <th>Heure facture</th>
            <th>Statut</th>
            <th>Raison refus</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(claim => (
            <tr key={claim.id}>
              <td>{claim.invoiceId}</td>
              <td>{claim.invoiceDate.slice(0, 10)}</td>
              <td>{claim.invoiceTime}</td>
              <td>{printStatus(claim.status)}</td>
              <td>{claim.reason}</td>
            </tr>  
          ))}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => {
  const props = {
    claims: getMyClaimsByDate(state)
  }
  return props
}

const ConnectedMyClaimsPage = connect(mapStateToProps, mapDispatchToProps)(MyClaimsPage)

export default ConnectedMyClaimsPage