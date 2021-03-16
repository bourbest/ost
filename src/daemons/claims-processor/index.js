
import {
  loadInvoicesAndClaims,
  loadClaimedUserInvoicesForEachClaim,
  validateClaimsAndComputeGains,
  saveClaimsAndGains
} from './process-claim'
import Poller from '../common/poller'
import {initializeContext, cleanupContext} from '../common/context'



const poller = new Poller(3 * 1000)

function processClaims() {
  return initializeContext()
    .then(loadInvoicesAndClaims)
    .then(loadClaimedUserInvoicesForEachClaim)
    .then(validateClaimsAndComputeGains)
    .then(saveClaimsAndGains)
    .then(cleanupContext)
    .then( () => {
      console.log('sleeping for 30 secs...')
      poller.poll()
    })
    .catch(ex => {
      console.log('exception triggered', ex)
    })
}

poller.onPoll(() => {
  console.log('starting another poll............')
  processClaims()
    .catch(ex => {
      console.log('exception triggered', ex)
    })
})

// Initial start
processClaims()