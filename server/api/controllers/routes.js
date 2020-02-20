import AccountsController from './AccountsController'
import AuthenticationController from './AuthenticationController'
import InvoiceClaimController from './InvoiceClaimController'
import CharacterController from './CharacterController'

export default function registerRoutes (router) {
  router.route('/accounts')
    .post(AccountsController.createAccount)

  router.route('/authenticate')
    .get(AuthenticationController.refreshToken)
    .post(AuthenticationController.login)
    .delete(AuthenticationController.logout)

  router.route('/xp/invoice-claim')
    .post(InvoiceClaimController.createClaim)

  router.route('/my-character')
    .get(CharacterController.getMyCharacter)

  router.route('/my-character/claims')
    .get(InvoiceClaimController.getMyClaims)
}