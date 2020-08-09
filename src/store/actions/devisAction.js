const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const ajouterDevis = (data) =>{
    return (dispatch ,getState)=>{     
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis:ajouter", {...data});

    ipcRenderer.once("devis:ajouter", function (event,res) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    
    if(Array.isArray(res)){
      dispatch({
          type : "AJOUTER_DEVIS",
          payload : res
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
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
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis:delete", {id, status :  "corbeille"});
  
    ipcRenderer.once('devis:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "ADD_TO_CORBEILLE_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload :data
    });
    }
  });
      
  
    }
  }
  //delete (mettre dans le corbeille)
export const addToCorbeilleMultiple = (data) =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "LOADING_DEVIS"
  })
  ipcRenderer.send("devis:delete-multi", {...data, status :  "corbeille"});

  ipcRenderer.once('devis:delete-multi', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_DEVIS"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "ADD_TO_CORBEILLE_DEVIS",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_DEVIS",
      payload :data
  });
  }
});
    

  }
}

  
export const getAllDevis = () =>{
    return (dispatch ,getState)=>{
  
      
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis", {});
  
    
    ipcRenderer.once('devis', function (event,data) {
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
   
    if(Array.isArray(data)){
      dispatch({
          type : "READ_ALL_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload :data
    });
    }
  });

    }
  }
  export const getDevis = (id) =>{
    return (dispatch ,getState)=>{
  
      
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis", {id});
  
    
    ipcRenderer.once('devis', function (event,data) {
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
  
   
    if(data){
      dispatch({
          type : "READ_ONE_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload :data
    });
    }
  });

    }
  }

  
//undo delete
export const undoDeleteDevis = (id) =>{
    return (dispatch ,getState)=>{
  
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis:delete", {id, status :  "undo"});
  
    ipcRenderer.once('devis:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "UNDO_DELETE_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload :data
    });
    }
  });
  
    }
  }
  

  //devis  
export const removeDevisCreated = () =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "REMOVE_DEVIS_CREATED"
  })
  
  }
}

export const removeDevisEdited = () =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "REMOVE_DEVIS_EDITED"
  })
  
  }
}


  export const modifierDevis = (data) =>{
    return (dispatch ,getState)=>{
      
        
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis:modifier", {...data});
  
    ipcRenderer.once('devis:modifier', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    
    if(Array.isArray(data.deviss)){
      dispatch({
          type : "MODIFIER_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload : data
    });
    }
  });
      
  }
  }

 export const  getPhasesProjetDeDevis = (data) =>{
    return (dispatch ,getState)=>{

      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("phaseProjetDevis:get", {...data});
  
    ipcRenderer.once('phaseProjetDevis:get', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(data){
      dispatch({
          type : "GET_PHASES_PROJET_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload : data
    });
    }
  });
      
    }
  }


  export const transformDevisAProjet = (data) =>{
    return (dispatch ,getState)=>{
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("devis:transform", {...data});
  
    ipcRenderer.once('devis:transform', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(data){
      dispatch({
          type : "DEVIS_TRANSFORM_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload : data
    });
    }
  });
    }
  }

  export const removeDevisTransformProjet = () =>{
    return (dispatch , getState)=>{

      dispatch({
        type : "REMOVE_DEVIS_TRANSFORM_PROJECT"
    })
    
    }
  }
   
  export const print = (data) =>{
    return (dispatch ,getState)=>{
      dispatch({
        type : "LOADING_DEVIS"
    })
    ipcRenderer.send("print:devis", {...data});
  
    ipcRenderer.once('print:devis', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(data){
      dispatch({
          type : "DEVIS_PRINT",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload : data
    });
    }
  });
    }
  }


  export const printToPdf = (data) =>{
    return (dispatch ,getState)=>{
    
    
    ipcRenderer.send("printToPdf:devis", {...data});
  
    ipcRenderer.once('printToPdf:devis', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(data){
      dispatch({
          type : "DEVIS_PRINT",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload : data
    });
    }
  });
    }
  }



     
//undo delete
export const undoDeleteDevisMultiple = (data) =>{
  return (dispatch ,getState)=>{

    dispatch({
      type : "LOADING_DEVIS"
  })
  ipcRenderer.send("devis:delete-multi", {...data, status :  "undo"});

  ipcRenderer.once('devis:delete-multi', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_DEVIS"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "UNDO_DELETE_DEVIS",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_DEVIS",
      payload :data
  });
  }
});

  }
}



  export const search = (data) =>{
    return (dispatch ,getState)=>{
     
    ipcRenderer.send("search:devis", {...data});
  
    ipcRenderer.once('search:devis', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_DEVIS"
    });
    if(data.found){
      dispatch({
          type : "SEARCH_IN_DEVIS",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_DEVIS",
        payload : data
    });
    }
  });
    }
  }