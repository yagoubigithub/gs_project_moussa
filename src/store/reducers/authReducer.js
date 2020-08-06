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
                users : action.payload.users,
                userEdited  :true,
            }
            case "REMOVE_USER_EDITED" :
            return {
                ...state,
                userEdited  : false,
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
        case 'ERROR_AUTH' : 
        console.log('ERROR_AUTH' , action.payload)
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

        case 'GET_ALL_USERS' :
            return {
                ...state,
                error : null,
                users : action.payload
            }
        case 'AJOUTER_AUTH' : 

        return {
            ...state,
            error : null,
            users :action.payload,
            userCreated : true,
        }
        case 'REMOVE_USER_CREATED' :
            return {
                ...state,
                userCreated : false
            }
        case 'ADD_TO_CORBEILLE_AUTH' : 
        return {
            ...state,
            users : action.payload
        }
        case 'UNDO_DELETE_AUTH' : 
        return {
            ...state,
            users : action.payload
        }
        default :
        return {
            ...state
        }

    }
    }
    export default authReducer;