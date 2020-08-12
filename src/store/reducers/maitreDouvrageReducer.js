

const initStat = {
    error :null,
   
};
const MaitreDouvrageReducer = (state = initStat, action) =>{
    switch(action.type){

        case 'LOADING_MAITRE_DOUVRAGE' :
            return{
                ...state,
                loading : true
            }
        case 'STOP_LOADING_MAITRE_DOUVRAGE' :
            return {
                ...state,
                loading : false
            }
        case 'MAITRE_DOUVRAGE_ERROR' :
            return {
                ...state,
                error : action.payload
            }
        case "AJOUTER_MAITRE_DOUVRAGE" :
            return {
                ...state,
                error :null,
                maitreDouvrages : action.payload,
                maitreDouvrageCreated : true
            }
            case "MODIFIER_MAITRE_DOUVRAGE" :
                console.log(action.payload)
                return {
                    ...state,
                    error : null,
                    maitreDouvrages :  action.payload.maitreDouvrages,
                    maitreDouvrage : action.payload.maitreDouvrage,
                    maitreDouvrageEdited : true
                }
            case 'REMOVE_MAITRE_DOUVRAGE_CREATED' : 

            return {
                ...state,
                maitreDouvrageCreated :  false
            }
            case 'DIRENAME' : 
        return {
            ...state,
            direname : action.payload,
            error : null

        }
        case 'READ_ONE_MAITRE_DOUVRAGE' : 
        return {
            ...state,
            maitreDouvrage : action.payload,
            error :  null
        }
    case 'READ_ALL_MAITRE_DOUVRAGE' :
       
   return {
                ...state,
                maitreDouvrages : action.payload,
                error :  null
            }

        
          case "UNDO_DELETE_MAITRE_DOUVRAGE" :
              return {
                  ...state,
                  maitreDouvrages : action.payload,
              error : null
  
              }
          
              case "ADD_TO_CORBEILLE_MAITRE_DOUVRAGE" :
              return {
                  ...state,
                  maitreDouvrages : action.payload,
                  error : null,
  
              }
             
                case 'ERROR_MAITRE_DOUVRAGE' : 
                return {
                    ...state,
                    error :  action.payload
                }
                
          
        default :
        return {
            ...state
        }

    }

}
export default MaitreDouvrageReducer;