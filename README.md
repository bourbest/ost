This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Voir le fichier README.react.md pour les instructions d'origine

## Pour tester le projet: 

### `npm run initdb`

utiliser ce script pour mettre à jour la BD ou l'initialiser (MongoDB doit être accessible sur le port standard).
Par la suite, si vous avez des modifications de BD à faire (créer des index), voir dans le répertoire "tools > revisions"

### `npm run server`

Roule le serveur et écoute pour les calls API. Le client ne peut pas rouler correctement pour l'instant sans le serveur.

### `npm start`

Lance le client React à l'adresse [http://localhost:3000](http://localhost:3000)

### `npm test`

Lance les tests unitaires automatisés en watch mode (i.e. dès que le code est modifié, les tests sont réexécutés. 
Vraiment cool si en plus vous utilisez vscode avec les extensions

## Structure des répertoires

### Tools
Dans ce répertoire, mettre tous les outils qui devraient être utilisés pour débugger ou initialiser l'environnement lors du déploiement.

### Tasks
Contient tous les scripts nécessaires au build / tests, etc. Bref, la grosse poutine de Webpack.

### Server
Tout ce qui concerne uniquement le serveur, bref les routes d'api, accès à la bd et middlewares.

### Modules
Contient tous les fichiers liés à la logique d'affaire, pouvant s'exécuter tant du côté du client que du côté du serveur (mettons qu'on voudrait faire du Server rendering). Chaque module est nommé avec un nom de pan de mur fonctionnel et contient les éléments suivants:
* actions : constantes et fonction d'action pour le Redux store
* schema: structures de données décrits avec la librairie sapin (voir plus loin).
* reducer: reducer Redux store
* saga: effets secondaires pour les actions Redux (généralement calls aux api)
* selectors: lire le store

### Entities
Brain fart lors de l'architecture. Pourrait être déplacé dans modules. Normalement c'est de la logique d'affaire utilisée uniquement côté
serveur. En le plaçant là, je voulais éviter que ca soit bundle dans le client (réduire taille). C'est utilisé par les deamons et soit par 
le client ou le serveur. 

### data
Permet au client (browser) de consommer les données de l'api (ou carrément contient des fichiers de données)
Les saga doivent utiliser la fonction createService pour instancier le service avec la bonne configuration d'api (celle-ci
inclut les cookies et autres trucs d'identification)

### deamons
* claim-processor: deamon qui roule quotidiennement pour traiter les claims (voir entités) et octroyer l'Xp et l'or aux utilisateur.
* invoice-loader: programme qui est prévu pour être lancé manuellement une fois par jour par l'admin. Il parse un fichier de factures pour
une journée et calcule, pour chaque facture, les XP et Or qui devraient être attribués pour chaque facture, en tenant compte des quêtes en vigueur pour la date de la facture.

### containers
Pages React de l'application. Normalement, il y a un répertoire par sous-route (section du site). Chaque Page est un composant React
connecté au store. 


## Orientations de développement

### Utilisation de la librairie Sapin

La librairie est un peu mal foutue et doit être copiée dans le projet (comme c'est le cas présentement)
Sans ca, elle fonctionne bien pour décrire et valider unitairement les messages échangés avec l'API ou les données à valider dans l'interface.
La doc est disponible sur GitHub [https://github.com/bourbest/sapin](bourbest/sapin)

### Calcul de l'or et de l'Xp
J'ai monté le système comme s'il s'agissait d'un système financier, i.e. on conserve toutes les transactions qui ont lieu et qui modifient
le total d'une de ces valeurs. Ainsi, si un bug est détecté, on peut relancer tous les calculs et les montants corrigés peuvent facilement
être attribués au personnage.

### Pipeline
La plupart des opérations asynchrones sont bâties comme des pipeline (séquence d'étape). Cela permet de tester plus facilement chaque
étape avec des tests automatisés et le résultat de la séquence se lit bien (à mon avis). Les api et deamons sont bâtis avec ce pattern.

## Entités

### Invoice
Facture qui est importée par l'admin. Voir /data/invoice.js pour la description des champs.
Le calcul de ce qui est octroyé pour une facture se trouve dans /entities/invoice-award.js

### InvoiceClaim
Les clients peuvent enregistrer une facture avant que l'admin n'ait eut le temps de charger les facture. Un claim est toute tentative d'inscroption d'une facture par un client. Il y aura un claim même si la facture correspondante a été chargée par l'admin. Un claim a un statut qui permet au client de savoir s'il a été traité et le résultat du traitement (et la raison du rejet le cas échéant). Voir /entities/invoice-claim pour la description des champs.

### Quest
Promotions qui affectent bonifient l'Xp et l'Or octroyés par une facture. L'orientation initiale est d'utiliser un fichier de chargement plutôt que de faire une interface de gestion pour minimiser les coûts. Je pensais monter un petit guide sur l'utilisation du shell de mongo et donner un fichier exemple pour le chargement des quêtes. Les quêtes sont utilisées lors du chargement des factures. Une fois une facture chargée dans le système, la modification à une quête n'affectera pas ces factures.

### Character
Personnage du client. L'orientation est de distinguer le personnage du compte utilisateur.
Le personnage contient une cache des l'xp et de l'or courant (pouvant être dépensés) et une cache de tout ce qui a été gagné depuis la création du personnage. Ces totaux n'incluent pas les montants des claims "pending" et pourraient être recalculés au besoin à tout moment.

### Perk
Avantage qu'il est possible d'acheter avec de l'Or, par exemple "Panier de pétake vicking gratuit". L'orientation initiale est d'utiliser un fichier de chargement plutôt que de faire une interface de gestion pour minimiser les coûts. Je pensais monter un petit guide sur l'utilisation du shell de mongo et donner un fichier exemple pour le chargement des Perk. 
Un Perk peut être acheté uniquement par un personnage ayant atteint le niveau minimum requis.

### CharacterPerk
Achat d'un avantage (Perk) par un personnage. Un perk peut être acheté plusieurs fois. Du point de vue "système financier", il s'agit d'une facture. Ainsi, on conserve le prix payé par le client pour l'achat du Perk, de sorte que si le prix change et qu'on doit recalculer l'or d'un personnage, le coût utilisé sera celui lors de l'achat.

### Scroll
Un scroll est un ticket unique qui octroie de l'Xp et/ou de l'Or. Ils seront principalement utilisés à la mise en place du système pour donner des avantages de départ à la clientèle fidèle. 
L'orientation initial est de programmer un deamon qui accepte en paramètre un nombre de scroll à produire, le bonus d'xp et d'or. Le deamon générerait ensuite dans la BD autant de scroll et l'ID du scroll serait un tiny-guid que l'utilisateur devrait saisir pour l'utiliser. Une fois le scroll utilisé, son id d'utilisateur est associé à l'enregistrement et il ne peut plus être utilisé

### Staff
Personnel de la chope qui peut valider les Perks. Chaque employé possède son code. Normalement, le client remet son téléphone avec le Perk loadé au serveur, qui rentre son code. Cette façon de faire évite qu'un client utilise par inadvertance son Perk et qu'on ait du niaisage à gérer.

### UserAccount
Compte utilisateur. C'est là-dedans qu'on mettrait courriel, mot de passe crypté, lock count, etc.