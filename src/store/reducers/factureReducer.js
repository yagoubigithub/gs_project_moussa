const initStat = {
    error: null,
  };
  const FactureReducer = (state = initStat, action) => {
    switch (action.type) {
      case "LOADING_FACTURE":
        return {
          ...state,
          loading: true,
        };
      case "STOP_LOADING_FACTURE":
        return {
          ...state,
          loading: false,
        };
  
      case "ERROR_FACTURE":
        return {
          ...state,
          error: action.payload,
        };
      case "AJOUTER_FACTURE":
        return {
          ...state,
          error: null,
          factures: action.payload,
          factureCreated: true,
        };
      case "MODIFIER_FACTURE":
        return {
          ...state,
          error: null,
          factures: action.payload.factures,
          facture: action.payload.facture,
          factureEdited: true,
        };
        case "REMOVE_DEVIS_EDITED" : 
        return{
          ...state,
          factureEdited : false
        }
      case "REMOVE_FACTURE_CREATED":
        return {
          ...state,
          factureCreated: false,
        };


        case "REMOVE_FACTURE_EDITED":
          return {
            ...state,
            factureEdited: false,
          };
      case "READ_ALL_FACTURE":
        return {
          ...state,
          factures: action.payload,
        };
      case "UNDO_DELETE_FACTURE":
        return {
          ...state,
          factures: action.payload,
        };
      case "ADD_TO_CORBEILLE_FACTURE":
        return {
          ...state,
          factures: action.payload,
        };
      case "GET_PHASES_PROJET_FACTURE":
        return {
          ...state,
          facture_phases_projets: action.payload,
        };
     
          case 'READ_ONE_FACTURE' :
            return {
              ...state,
              facture : action.payload,
              error : null
            }
            case 'AJOUTER_PAIEMENT_FACTURE' :
              return {
                ...state,
                etat_factures : action.payload,
                paiementAdded : true
              }
              case 'REMOVE_PAIEMENT_ADDED':
                return {
                  ...state,
                  paiementAdded : false
                }
              case 'READ_ALL_ETAT_FACTURE' :
                return {
                  ...state,
                  etat_factures : action.payload,
                  error : null
                }

                case 'AJOUTER_PAIEMENT_ETAT_FACTURE' :
                  return {
                    ...state,
                    etat_factures : action.payload,
                    error : null,
                    paiementAdded : true


                  }
  
            case 'READ_ALL_STATISTIQUE_FACTURE' :

            return{
              ...state,
              statistique : action.payload
            }
      default:
        return {
          ...state,
        };
    }
  };
  export default FactureReducer;
  