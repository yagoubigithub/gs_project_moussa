const electron = require("electron");
const isDev = require("electron-is-dev");
require('v8-compile-cache');



const { app  } = electron;

app.disableDomainBlockingFor3DAPIs()

app.on("ready", () => {



  const mainWindow = require('./mainWindow');
  mainWindow.maximize();
  // mainWindow.setMenu(null);
   mainWindow.show();

    const DevTools = require('./devTools')
  const devTools = new DevTools(isDev);

  const User = require('./user');
  const user = new User();

  const Entreprise = require('./entreprise');
  const entreprise = new Entreprise();

  const MaitreDouvrage = require('./maitreDouvrage');
  const maitreDouvrage = new MaitreDouvrage();
  
  const Projet = require('./projet');
  const projet = new Projet();
  
  const PhasesProjet = require('./phasesProjet');
  const phasesProjet = new PhasesProjet();


  const Devis = require('./devis');
  const devis = new Devis();

  const PrintDevis = require('./printDevis');
  const printDevis = new PrintDevis();


  
  const PrintFacture = require('./printFacture');
  const printFacture = new PrintFacture();


  
  const Facture = require('./facture');
  const facture = new Facture();
  
});