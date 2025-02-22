import {    combineReducers } from 'redux';

import authReducer from './authReducer';
import entrepriseReducer from './entrepriseReducer';
import maitreDouvrageReducer from './maitreDouvrageReducer';
import projetReducer from './projetReducer';
import pahsesProjetReducer from './pahsesProjetReducer';
import devisReducer from './devisReducer';
import factureReducer from './factureReducer';
import keyReducer from './keyReducer';


const rootReducer  = combineReducers({
 
    auth : authReducer,
    entreprise : entrepriseReducer,
    maitre_douvrage : maitreDouvrageReducer,
    projet : projetReducer,
    phases_projet  : pahsesProjetReducer,
    devis : devisReducer,
    facture : factureReducer,
    key : keyReducer
   
  
    
});

export default rootReducer;