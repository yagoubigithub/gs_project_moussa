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
          type : "AJOUTER_PROJET",
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

  
//undo delete
export const undoDeleteProjet = (id) =>{
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
    if(data){
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