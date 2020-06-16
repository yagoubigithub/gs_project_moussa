const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const ajouterFacture = (data) =>{
    return (dispatch ,getState)=>{     
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture:ajouter", {...data});

    ipcRenderer.once("facture:ajouter", function (event,res) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    
    if(Array.isArray(res)){
      dispatch({
          type : "AJOUTER_FACTURE",
          payload : res
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload : res
    });
    }
});
      
   

    }
}

//delete (mettre dans le corbeille)
export const addToCorbeille = (id) =>{
    return (dispatch , getState)=>{
  
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture:delete", {id, status :  "corbeille"});
  
    ipcRenderer.once('facture:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "ADD_TO_CORBEILLE_FACTURE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload :data
    });
    }
  });
      
  
    }
  }

  
export const getAllFacture = () =>{
    return (dispatch ,getState)=>{
  
      
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture", {});
  
    
    ipcRenderer.once('facture', function (event,data) {
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
   
    if(Array.isArray(data)){
      dispatch({
          type : "READ_ALL_FACTURE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload :data
    });
    }
  });

    }
  }
  export const getFacture = (id) =>{
    return (dispatch ,getState)=>{
  
      
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture", {id});
  
    
    ipcRenderer.once('facture', function (event,data) {
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
   
   
    if(data){
      dispatch({
          type : "READ_ONE_FACTURE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload :data
    });
    }
  });

    }
  }

  
//undo delete
export const undoDeleteFacture     = (id) =>{
    return (dispatch ,getState)=>{
  
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture:delete", {id, status :  "undo"});
  
    ipcRenderer.once('facture:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "UNDO_DELETE_FACTURE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload :data
    });
    }
  });
  
    }
  }
  

  //devis  
export const removeFactureCreated = () =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "REMOVE_FACTURE_CREATED"
  })
  
  }
}


  export const modifierFacture = (data) =>{
    return (dispatch ,getState)=>{
      
        
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture:modifier", {...data});
  
    ipcRenderer.once('facture:modifier', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    if(data){
      dispatch({
          type : "MODIFIER_FACTURE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload : data
    });
    }
  });
      
  }
  }

 export const  getPhasesProjetDeFacture = (data) =>{
    return (dispatch ,getState)=>{

      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("phaseProjetFacture:get", {...data});
  
    ipcRenderer.once('phaseProjetFacture:get', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    if(data){
      dispatch({
          type : "GET_PHASES_PROJET_FACTURE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload : data
    });
    }
  });
      
    }
  }


  
  export const print = (data) =>{
    return (dispatch ,getState)=>{
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("print:facture", {...data});
  
    ipcRenderer.once('print:facture', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    if(data){
      dispatch({
          type : "FACTURE_PRINT",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload : data
    });
    }
  });
    }
  }

  export const printToPdf = (data) =>{
    return (dispatch ,getState)=>{
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("printToPdf:facture", {...data});
  
    ipcRenderer.once('printToPdf:facture', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    if(data){
      dispatch({
          type : "FACTURE_PRINT",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload : data
    });
    }
  });
    }
  }


  export const ajouterPaiement = (data) =>{
    return (dispatch, getState) => {
      dispatch({
        type : "LOADING_FACTURE"
    })
    ipcRenderer.send("facture:ajouterPaiement", {...data});

    ipcRenderer.once("facture:ajouterPaiement", function (event,res) {
     
      dispatch({
        type : "STOP_LOADING_FACTURE"
    });
    
    if(Array.isArray(res)){
      dispatch({
          type : "AJOUTER_PAIEMENT_FACTURE",
          payload : res
      });
    }else{
      dispatch({
        type : "ERROR_FACTURE",
        payload : res
    });
    }
});
      
   




    }
  }


  export const removePaiementAdded = () =>{
    return (dispatch, getState)=>{
      dispatch({
        type : "REMOVE_PAIEMENT_ADDED"
      })
    }
  }