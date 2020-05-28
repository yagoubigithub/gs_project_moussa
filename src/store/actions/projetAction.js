const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const ajouterProjet = (data) =>{
    return (dispatch ,getState)=>{     
      dispatch({
        type : "LOADING_PROJET"
    })
    ipcRenderer.send("projet:ajouter", {...data});

    ipcRenderer.once("projet:ajouter", function (event,res) {
     
      dispatch({
        type : "STOP_LOADING_PROJET"
    });
    
    if(Array.isArray(res)){
      dispatch({
          type : "AJOUTER_PROJET",
          payload : res
      });
    }else{
      dispatch({
        type : "ERROR_PROJET",
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
        type : "LOADING_PROJET"
    })
    ipcRenderer.send("projet:delete", {id, status :  "corbeille"});
  
    ipcRenderer.once('projet:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_PROJET"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "ADD_TO_CORBEILLE_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PROJET",
        payload :data
    });
    }
  });
      
  
    }
  }

  
export const getAllProjet = () =>{
    return (dispatch ,getState)=>{
  
      
      dispatch({
        type : "LOADING_PROJET"
    })
    ipcRenderer.send("projet", {});
  
    
    ipcRenderer.once('projet', function (event,data) {
      dispatch({
        type : "STOP_LOADING_PROJET"
    });
   
    if(Array.isArray(data)){
      dispatch({
          type : "READ_ALL_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PROJET",
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
        type : "LOADING_PROJET"
    })
    ipcRenderer.send("projet:delete", {id, status :  "undo"});
  
    ipcRenderer.once('projet:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_PROJET"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "UNDO_DELETE_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PROJET",
        payload :data
    });
    }
  });
  
    }
  }
  

  //projet  
export const removeProjetCreated = () =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "REMOVE_PROJET_CREATED"
  })
  
  }
}


  export const modifierProjet = (data) =>{
    return (dispatch ,getState)=>{
      
        
      dispatch({
        type : "LOADING_PROJET"
    })
    ipcRenderer.send("projet:modifier", {...data});
  
    ipcRenderer.once('projet:modifier', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_PROJET"
    });
    if(data){
      dispatch({
          type : "MODIFIER_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PROJET",
        payload : data
    });
    }
  });
      
  }
  }