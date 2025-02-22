
const initStat = {
    error :null,
   
};
const ProjetReducer = (state = initStat, action) =>{
    switch(action.type){

        case 'LOADING_PROJET' :
            return{
                ...state,
               loading : true
            }
        case 'STOP_LOADING_PROJET' :
            return {
                ...state,
                loading : false
            }


            case 'ERROR_PROJET' :
                return {
                    ...state,
                    error : action.payload
                }
            case "AJOUTER_PROJET" :
                return {
                    ...state,
                    error :null,
                    projets : action.payload,
                    projetCreated : true
                }
                case "MODIFIER_PROJET" :
                    return {
                        ...state,
                        error : null,
                        projets :  action.payload.projets,
                        projet : {
                            ...action.payload.projet,
                            phasesProjets : action.payload.projet.phasesProjetsSelected},
                        projetEdited : true
                    }
                    case 'REMOVE_PROJET_CREATED' : 
                    return {
                        ...state,
                        projetCreated : false
                    }
                    case 'REMOVE_PROJET_EDITED':
                        return{
                            ...state,
                            projetEdited : false,
                            projet : undefined
                        }
                    case 'READ_ALL_PROJET' :
                        return {
                            ...state,
                            projets : action.payload
                        }
                    case 'READ_ONE_PROJET' : 
                    return {
                        ...state,
                        projet : action.payload,
                        error : null,
                    }
                    case 'UNDO_DELETE_PROJET' : 
                    return {
                        ...state,
                        projets : action.payload
                    }
                    case 'ADD_TO_CORBEILLE_PROJET' : 
                    return {
                        ...state,
                        projets : action.payload
                    }

                    case 'FINI_PROJET' : 
                    return {
                        ...state,
                        projets : action.payload
                    }
            default :
            return {
                ...state
            }
    
        }
    
    }
    export default ProjetReducer;