
const initStat = {
    error :null,
   
};
const PhasesProjetReducer = (state = initStat, action) =>{
    switch(action.type){

        case 'LOADING_PHASES_PROJET' :
            return{
                ...state,
               loading : true
            }
        case 'STOP_LOADING_PHASES_PROJET' :
            return {
                ...state,
                loading : false
            }


            case 'PHASES_PROJET_ERROR' :
                return {
                    ...state,
                    error : action.payload
                }
            case "AJOUTER_PAHSES_PROJET" :
                return {
                    ...state,
                    error :null,
                    phasesProjets : action.payload,
                    phasesProjetCreated : true
                }
                case "MODIFIER_PHASES_PROJET" :
                    return {
                        ...state,
                        error : null,
                        phasesProjets :  action.payload.phasesProjets,
                        phasesProjet : action.payload.phasesProjet,
                        phasesProjetEdited : true
                    }
                    case 'REMOVE_PHASES_PROJET_CREATED' : 
                    return {
                        ...state,
                        phasesProjetCreated : false
                    }
                    case 'READ_ALL_PHASES_PROJET' :
                        return {
                            ...state,
                            phasesProjets : action.payload
                        }
                        case 'ADD_TO_CORBEILLE_PHASES_PROJET' : 
                        return {
                            ...state,
                            phasesProjets : action.payload
                        }
                        case 'UNDO_DELETE_PHASES_PROJET'  : 
                        return {

                            ...state,
                            phasesProjets : action.payload
                        }
            default :
            return {
                ...state
            }
    }
    }
    export default PhasesProjetReducer;