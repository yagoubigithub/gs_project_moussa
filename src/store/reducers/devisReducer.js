
const initStat = {
    error :null,
   
};
const DevisReducer = (state = initStat, action) =>{
    switch(action.type){

        case 'LOADING_DEVIS' :
            return{
                ...state,
               loading : true
            }
        case 'STOP_LOADING_DEVIS' :
            return {
                ...state,
                loading : false
            }


            case 'ERROR_DEVIS' :
                return {
                    ...state,
                    error : action.payload
                }
            case "AJOUTER_DEVIS" :
                return {
                    ...state,
                    error :null,
                    deviss : action.payload,
                    devisCreated : true
                }
                case "MODIFIER_DEVIS" :
                    return {
                        ...state,
                        error : null,
                        deviss :  action.payload.deviss,
                        devis : action.payload.devis,
                        devisEdited : true
                    }
                    case 'REMOVE_DEVIS_CREATED' : 
                    return {
                        ...state,
                        devisCreated : false
                    }
                    case 'READ_ALL_DEVIS' :
                        return {
                            ...state,
                            deviss : action.payload
                        }
                    case 'UNDO_DELETE_DEVIS' : 
                    return {
                        ...state,
                        deviss : action.payload
                    }
                    case 'ADD_TO_CORBEILLE_DEVIS' : 
                    return {
                        ...state,
                        deviss : action.payload
                    }
                    case 'GET_PHASES_PROJET_DEVIS':
                        return {
                            ...state,
                            devis_phases_projets : action.payload
                        }
                        case 'REMOVE_DEVIS_TRANSFORM_PROJECT' : 
                        return {
                            ...state,
                            devisTransformProject : false,
                        }
                        case 'DEVIS_TRANSFORM_PROJET' : 
                        return {
                            ...state,
                            devisTransformProject : true,
                            error : null,
                            deviss : action.payload
                        }

            default :
            return {
                ...state
            }
    
        }
    
    }
    export default DevisReducer;