import AccountsController from './AccountsController'
import AuthenticationController from './AuthenticationController'
import InvoiceClaimController from './InvoiceClaimController'
import CharacterController from './CharacterController'
import ScrollController from './ScrollController'
import PerksController from './PerksController'

export default function registerRoutes (router) {
  router.route('/accounts')
    .post(AccountsController.createAccount)

  router.route('/authenticate')
    .get(AuthenticationController.refreshToken)
    .post(AuthenticationController.login)
    .delete(AuthenticationController.logout)

  // add Xp routes
  router.route('/invoice-claims')
    .post(InvoiceClaimController.createClaim)

  router.route('/scrolls/:id/use')
    .post(ScrollController.useScroll)

  // Character routes
  router.route('/my-character')
    .get(CharacterController.getMyCharacter)

  router.route('/my-character/claims')
    .get(InvoiceClaimController.getMyClaims)

  router.route('/my-character/perks')
    .get(PerksController.getMyPerks)

  router.route('/my-character/perks/use')
    .post(PerksController.usePerk)

  // perks route
  router.route('/perks')
    .get(PerksController.getAll)

  router.route('/perks/:perkId/buy')
    .post(PerksController.buyPerk)
}