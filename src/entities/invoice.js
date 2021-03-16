
import {getFloatTime} from './utils'

/* schema
{ 
  "_id" : "259211-1", // généré par le système 
  "items" : [ { // liste des items commandés
     "qty" : 1, 
     "item" : "SOUP.OIGNON GRATINE"
   }], 
  "date" : ISODate("2020-02-16T00:00:00Z"), // date de la facture. La journée doit être normalisée pour les quêtes (voir effectiveDate)
  "subTotal" : 19.9, 
  "subTotalPromo" : NaN, // 
  "total" : 22.89, // total inscrit sur la facture
  "time" : "15:01", // heure de sortie de la facture
  "server" : "Astrid", // nom du serveur (tel qu'enregistré dans le système de facturation)
  "paymentMethod" : "VISA", 
  "effectiveDate" : ISODate("2020-02-16T00:00:00Z"), // date normalisée pour l'application des quêtes
  "claimedBy" : null, // Id de l'utilisateur qui a réclamé la facture et qui en tire l'xp et l'or
  "award" : {  // résumé de ce que la facture donne
    "questId" : null,  // Actuellement une seule quete par facture, mais devrait permettre plusieurs
    "baseXp" : 120, // xp de base octroyé sans quête
    "bonusXp" : 0,  // xp bonus gagné avec la quête.
    "totalXp" : 120,  // xp total octroyé par la facture
    "baseGold" : 40, 
    "bonusGold" : 0, 
    "totalGold" : 40 }
  }

*/

// whatever comes before 6am is considered bought the previous day
export function computeEffectiveDate(date, time) {
  const hour = getFloatTime(time)
  const effectiveDate = new Date(date)
  if (hour < 6) {
    effectiveDate.setDate(effectiveDate.getDate() - 1) 
  }
  return effectiveDate
}