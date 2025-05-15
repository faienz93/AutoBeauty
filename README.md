# React + TypeScript + Vite


https://ionicframework.com/docs/react/adding-ionic-react-to-an-existing-react-project

```
npm run dev
```


Create .env file in the root of project
```
VITE_TEST_ENV_NAME=TEST
VITE_TEST_API_KEY=xxx
VITE_TEST_AUTH_DOMAIN=xxx
VITE_TEST_PROJECT_ID=xxx
VITE_TEST_STORAGE_BUCKET=xxx
VITE_TEST_MESSAGING_SENDER_ID=xxx
VITE_TEST_APP_ID=xxx
VITE_TEST_COLLECTION=dev-maintenances
```

# Icons
https://www.svgrepo.com/

# SQLite
https://jepiqueau.github.io/2023/08/31/Ionic7React-SQLite-CRUD-App.html
Quando si dovrà deployare l'applicazione usare questo https://jepiqueau.github.io/2023/08/31/Ionic7React-SQLite-CRUD-App.html#install-native-required-packages

- questo dovrebbe essere quello corretto https://github.com/capacitor-community/sqlite/blob/master/docs/Ionic-React-Usage.md#ionic/react-app.
Per quando ci si sposta sui dispositivi si dovrebbero cancellare dei file e per questo si puà vedere questo https://jepiqueau.github.io/2023/08/31/Ionic7React-SQLite-CRUD-App.html (PARTE 2)

In questo progetto viene utilizzato PouchDb perchè offre ottime prestazioni. E' cross platform e ha la possibilità di sincronizzarsi con CouchDb o PouchDb Server.
Al fine di garantre un esperienza d'uso ottimale si è scelto di usare IndexDB per il web e SQLite su dispositivi mobile

## Utilizzo di AdapterSQLite
REF: https://github.com/nolanlawson/pouchdb-ionic-2-hello-world-with-sqlite

> Then I installed PouchDB:

> npm install pouchdb-browser --save
> (I used the pouchdb-browser package because we don't need Node/LevelDB dependencies to run in Ionic, so we can skip installing the Node dependencies. You could also use the pouchdb package.)
> Then I installed pouchdb-adapter-cordova-sqlite:

>npm install pouchdb-adapter-cordova-sqlite --save
>Then I added the native SQLite plugin (I'm using cordova-plugin-sqlite-2, but there are others):

(Infatti io uso cordova-sqlite-storage perchè da local storage di ionic si usa questo https://github.com/ionic-team/ionic-storage#sqlite-installation)

>cordova plugin add cordova-plugin-sqlite-2 --save
>Then I imported PouchDB in JavaScript, and registered the plugin:

>import * as PouchDB from 'pouchdb-browser';
>import * as cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
>PouchDB.plugin(cordovaSqlitePlugin);

poi ho installato usando typescript, come dice la documentazione i tipi
https://pouchdb.com/guides/setup-pouchdb.html#typescript

npm install pouchdb @types/pouchdb

In your tsconfig.json activate allowSyntheticDefaultImports:

{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}

siccome ottenevo un errore https://stackoverflow.com/a/75819381/4700162 alla fine ho dovuto fare questo per la mia app react

## TODO

- [x] aggiungere il campo note quando si inserisce un un nuovo item
- [x] fixare problema della data
- [x] aggiungere salvataggio su firebase
- [ ] sqitchare su SQLite
- [ ] dare la possibilità di modificare item
- [ ] visualizzare nella home quello che è l'ultimo intervento fatto
- [ ] fare una sezione con il grafico