# Shekinaël — Une petite aventure d’amour ❤️

Une expérience romantique interactive créée avec React, TypeScript et Vite. Les photos et la piste musicale sont choisies dans le code avant la mise en production ; l’interface du destinataire ne permet pas de les modifier.

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
- **Musique :** modifiez `DEFAULT_MUSIC_TRACK` dans `src/config.ts`. Les identifiants disponibles sont `music-box`, `soft-piano` et `starlight-waltz`.
- **Noms et numéro WhatsApp :** modifiez `DEFAULT_CONFIG` dans `src/config.ts`.

Après ces changements, lancez `npm run lint` puis `npm run build` avant le déploiement. Le destinataire peut consulter les photos et contrôler la lecture/le volume, mais ne peut ni modifier l’album ni choisir une autre piste.

Les réponses choisies au quiz restent uniquement dans l’étape du quiz et ne sont pas enregistrées ni envoyées. À la dernière étape, la destinataire peut choisir d’ouvrir ou non une conversation WhatsApp avec le numéro configuré. Aucun message ni aucune réponse n’est prérempli ou envoyé : elle écrit elle-même, si elle le souhaite.

La musique démarre au premier clic sur l’enveloppe. Ce clic est nécessaire pour autoriser la lecture audio dans la plupart des navigateurs.