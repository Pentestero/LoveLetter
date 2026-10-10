# Shekinaël — Une petite aventure d’amour ❤️

Une expérience romantique interactive créée avec React, TypeScript et Vite. Les photos sont choisies dans le code avant la mise en production. Une mélodie instrumentale originale est synthétisée dans le navigateur et joue en boucle après l’ouverture de l’enveloppe.

## Lancer le projet

Prérequis : Node.js 20.19 ou plus récent.

```sh
npm install
npm run dev
```

Vérification TypeScript : `npm run lint`  
Build de production : `npm run build`

## Personnaliser avant le déploiement

- **Photos :** remplacez les images importées et leurs légendes dans `src/config.ts`. Les trois images sont empaquetées par Vite pour fonctionner aussi dans le build de production.
- **Photo de la déclaration finale :** la photo `Sheki1.jpg` est affichée dans la dernière étape. Pour la remplacer, ajoutez votre image dans `src/assets/images/`, importez-la dans `src/config.ts`, puis affectez-la à `FINAL_DECLARATION_PHOTO`.
- **Musique :** choisissez une mélodie synthétisée (`music-box`, `soft-piano`, `starlight-waltz` ou `cinematic-love`) dans `DEFAULT_MUSIC_TRACK`, dans `src/config.ts`.
- **Noms et numéro WhatsApp :** modifiez `DEFAULT_CONFIG` dans `src/config.ts`.

Après ces changements, lancez `npm run lint` puis `npm run build` avant le déploiement. Il n’y a plus de fichier MP3 importé ni de barre de lecture. Les navigateurs mobiles bloquent la lecture automatique sans interaction : la mélodie démarre au toucher de l’enveloppe.

Les réponses choisies au quiz restent uniquement dans l’étape du quiz et ne sont pas enregistrées ni envoyées. À la dernière étape, la destinataire peut choisir d’ouvrir ou non une conversation WhatsApp avec le numéro configuré. Aucun message ni aucune réponse n’est prérempli ou envoyé : elle écrit elle-même, si elle le souhaite.

La mélodie démarre au premier toucher de l’enveloppe. Cette interaction est nécessaire, car les navigateurs mobiles interdisent le son automatique avant un geste de la personne.