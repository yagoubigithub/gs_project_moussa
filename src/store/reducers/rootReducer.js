import {    combineReducers } from 'redux';

import authReducer from './authReducer';
import entrepriseReducer from './entrepriseReducer';
import maitreDouvrageReducer from './maitreDouvrageReducer';
import projetReducer from './projetReducer';
import pahsesProjetReducer from './pahsesProjetReducer';
import devisReducer from './devisReducer';


const rootReducer  = combineReducers({
 
    auth : authReducer,
    entreprise : entrepriseReducer,
    maitre_douvrage : maitreDouvrageReducer,
    projet : projetReducer,
    phases_projet  : pahsesProjetReducer,
    devis : devisReducer
   
  
    
});

export default rootReducer;