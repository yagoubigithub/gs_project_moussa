const initStat = {
  error: null,
  key: [],
};
const keyReducer = (state = initStat, action) => {
  switch (action.type) {
    case "KEY_ERROR":
      return {
        ...state,
        error: action.payload,
      };

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
