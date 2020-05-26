
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
                        projet : action.payload.projet,
                        projetEdited : true
                    }
                    case 'REMOVE_PROJET_CREATED' : 
                    return {
                        ...state,
                        projetCreated : false
                    }
                    case 'READ_ALL_PROJET' :
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