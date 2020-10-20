const initStat = {
  error: null,
  key: [],
};
const keyReducer = (state = initStat, action) => {
  switch (action.type) {
    case "STOP_LOADING_KEY" :
      return {
        ...state,
        loading : false
      };
      case "LOADING_KEY" :
        return {
          ...state,
          loading : true
        };
    case "KEY_ERROR":
      return {
        ...state,
        error: action.payload,
      };

      case "ERROR_KEY" : 

      return{
        ...state,
        error : action.payload
      }
      case 'AJOUTER_KEY' :
        

      return {
        ...state,
        error : null,
        key: action.payload,
        keyCreated : true
      }

    case "GET_KEY":
      return {
        ...state,
        error: null,
        key: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
export default keyReducer;
