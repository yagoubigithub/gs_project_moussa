const initStat = {
    error :null,
   
};
const entrepriseReducer = (state = initStat, action) =>{
    switch(action.type){

        case 'LOADING_ENTREPRISE' :
            return{
                ...state,
                loading : true
            }
        case 'STOP_LOADING_ENTREPRISE' :
            return {
                ...state,
                loading : false
            }
        case 'ENTREPRISE_ERROR' :
            return {
                ...state,
                error : action.payload
            }
        case "AJOUTER_ENTREPRISE" :
            return {
                ...state,
                error :null,
                info : action.payload
            }
            case 'GET_ONE_ENTREPRISE' : 
            return {
                ...state,
                error :null,
                info : action.payload
            }
            case 'MODIFIER_ENTREPRISE':
                return {
                    ...state,
                    error :null,
                    info : action.payload
                }
        default :
        return {
            ...state
        }

    }

}
export default entrepriseReducer;