const initStat = {
    error :null,
   
};
const authReducer = (state = initStat, action) =>{
    switch(action.type){

        case 'LOADING_AUTH' :
            return{
                ...state,
                loading : true
            }
        case 'MODIFIER_AUTH':
            return {
                ...state,
                error :null,
                user : action.payload
            }
        case 'STOP_LOADING_AUTH' :
            return {
                ...state,
                loading : false
            }
        case 'AUTH_ERROR' :
            return {
                ...state,
                error : action.payload
            }
        case "AUTH_SUCCESS" :
            return {
                ...state,
                error :null,
                user : action.payload
            }
        default :
        return {
            ...state
        }

    }
    }
    export default authReducer;