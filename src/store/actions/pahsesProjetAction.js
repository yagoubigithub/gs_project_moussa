const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const ajouterPahsesProjet = (data) =>{
    return (dispatch ,getState)=>{     
      dispatch({
        type : "LOADING_PAHSES_PROJET"
    })
    ipcRenderer.send("phases_projet:ajouter", {...data});

    ipcRenderer.once("phases_projet:ajouter", function (event,res) {
     
      dispatch({
        type : "STOP_LOADING_PAHSES_PROJET"
    });
    console.log(res)
    if(Array.isArray(res)){
      dispatch({
          type : "AJOUTER_PAHSES_PROJET",
          payload : res
      });
    }else{
      dispatch({
        type : "ERROR_PAHSES_PROJET",
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
        type : "LOADING_PHASES_PROJET"
    })
    ipcRenderer.send("phases_projet:delete", {id, status :  "corbeille"});
  
    ipcRenderer.once('phases_projet:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_PHASES_PROJET"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "ADD_TO_CORBEILLE_PHASES_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PHASES_PROJET",
        payload :data
    });
    }
  });
      
  
    }
  }

  
export const getAllPhasesProjet = () =>{
    return (dispatch ,getState)=>{
  
      
      dispatch({
        type : "LOADING_PHASES_PROJET"
    })
    ipcRenderer.send("phases_projet", {});
  
    
    ipcRenderer.once('phases_projet', function (event,data) {
      dispatch({
        type : "STOP_LOADING_PHASES_PROJET"
    });
   
    if(Array.isArray(data)){
      dispatch({
          type : "READ_ALL_PHASES_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PHASES_PROJET",
        payload :data
    });
    }
  });

    }
  }

  export const getPhasesProjet = (id) =>{
    return (dispatch ,getState)=>{
      dispatch({
        type : "LOADING_PHASES_PROJET"
    })
    ipcRenderer.send("phases_projet", {id});  
    ipcRenderer.once('phases_projet', function (event,data) { 
      dispatch({
        type : "STOP_LOADING_PHASES_PROJET"
    });
    if(data.nom){
      dispatch({
          type : "READ_ONE_PHASES_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PHASES_PROJET",
        payload :data
    });
    }
  });
      
  
  
    }
  }

  
//undo delete
export const undoDeletePhasesProjet = (id) =>{
    return (dispatch ,getState)=>{
  
      dispatch({
        type : "LOADING_PHASES_PROJET"
    })
    ipcRenderer.send("phases_projet:delete", {id, status :  "undo"});
  
    ipcRenderer.once('phases_projet:delete', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_PHASES_PROJET"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "UNDO_DELETE_PHASES_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PHASES_PROJET",
        payload :data
    });
    }
  });
  
    }
  }
  

  //projet  
export const removePhasesProjetCreated = () =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "REMOVE_PHASES_PROJET_CREATED"
  })
  
  }
}


  export const modifierPhasesProjet = (data) =>{
    return (dispatch ,getState)=>{
      
        
      dispatch({
        type : "LOADING_PHASES_PROJET"
    })
    ipcRenderer.send("phases_projet:modifier", {...data});
  
    ipcRenderer.once('phases_projet:modifier', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_PHASES_PROJET"
    });
    if(data){
      dispatch({
          type : "MODIFIER_PHASES_PROJET",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_PHASES_PROJET",
        payload : data
    });
    }
  });
      
  }
  }