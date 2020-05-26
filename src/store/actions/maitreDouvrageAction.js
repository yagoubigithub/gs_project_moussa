const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const ajouterMaitreDouvrage = (data) =>{
    return (dispatch ,getState)=>{
    
      
      dispatch({
        type : "LOADING_MAITRE_DOUVRAGE"
    })
    ipcRenderer.send("maitre_douvrage:ajouter", {...data});

    ipcRenderer.once('maitre_douvrage:ajouter', function (event,data) {
     
      dispatch({
        type : "STOP_LOADING_MAITRE_DOUVRAGE"
    });
    if(Array.isArray(data)){
      dispatch({
          type : "AJOUTER_MAITRE_DOUVRAGE",
          payload : data
      });
    }else{
      dispatch({
        type : "ERROR_MAITRE_DOUVRAGE",
        payload : data
    });
    }
});
      
   

    }
}
//MAITRE_DOUVRAGE entree 
export const removeMaitreDouvrageCreated = () =>{
    return (dispatch , getState)=>{
  
      dispatch({
        type : "REMOVE_MAITRE_DOUVRAGE_CREATED"
    })
    
    }
  }
  

  
export const getLogo = (id) =>{
  return (dispatch ,getState)=>{

    
    dispatch({
      type : "LOADING_MAITRE_DOUVRAGE"
  })
  ipcRenderer.send("maitre_douvrage:logo", {id});

  
  ipcRenderer.once('maitre_douvrage:logo', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_MAITRE_DOUVRAGE"
  });
  if(data){
    dispatch({
        type : "READ_MAITRE_DOUVRAGE_LOGO",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_MAITRE_DOUVRAGE",
      payload :data
  });
  }
});

  }
}


//delete (mettre dans le corbeille)
export const addToCorbeille = (id) =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "LOADING_MAITRE_DOUVRAGE"
  })
  ipcRenderer.send("maitre_douvrage:delete", {id, status :  "corbeille"});

  ipcRenderer.once('maitre_douvrage:delete', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_MAITRE_DOUVRAGE"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "ADD_TO_CORBEILLE_MAITRE_DOUVRAGE",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_MAITRE_DOUVRAGE",
      payload :data
  });
  }
});
    

  }
}

export const getDirename = () =>{
  return (dispatch ,getState)=>{
  ipcRenderer.send("direname", {});
  ipcRenderer.once('direname', function (event,data) {
  if(data){
     dispatch({
        type : "DIRENAME",
        payload : data
    });
  }
  
});
  
  }
}


export const getAllMaitreDouvrage = () =>{
  return (dispatch ,getState)=>{

    
    dispatch({
      type : "LOADING_MAITRE_DOUVRAGE"
  })
  ipcRenderer.send("maitre_douvrage", {});

  
  ipcRenderer.once('maitre_douvrage', function (event,data) {
    dispatch({
      type : "STOP_LOADING_MAITRE_DOUVRAGE"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "READ_ALL_MAITRE_DOUVRAGE",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_MAITRE_DOUVRAGE",
      payload :data
  });
  }
});
    
    

   

  }
}


export const getMaitreDouvrage = (id) =>{
  return (dispatch ,getState)=>{
    dispatch({
      type : "LOADING_MAITRE_DOUVRAGE"
  })
  ipcRenderer.send("maitre_douvrage", {id});  
  ipcRenderer.once('maitre_douvrage', function (event,data) { 
    dispatch({
      type : "STOP_LOADING_MAITRE_DOUVRAGE"
  });
  if(data.nom){
    dispatch({
        type : "READ_ONE_MAITRE_DOUVRAGE",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_MAITRE_DOUVRAGE",
      payload :data
  });
  }
});
    


  }
}

//undo delete
export const undoDeleteMaitreDouvrage = (id) =>{
  return (dispatch ,getState)=>{

    dispatch({
      type : "LOADING_MAITRE_DOUVRAGE"
  })
  ipcRenderer.send("maitre_douvrage:delete", {id, status :  "undo"});

  ipcRenderer.once('maitre_douvrage:delete', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_MAITRE_DOUVRAGE"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "UNDO_DELETE_MAITRE_DOUVRAGE",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_MAITRE_DOUVRAGE",
      payload :data
  });
  }
});

  }
}


export const modifierMaitreDouvrage = (data) =>{
  return (dispatch ,getState)=>{
    
      
    dispatch({
      type : "LOADING_MAITRE_DOUVRAGE"
  })
  ipcRenderer.send("maitre_douvrage:modifier", {...data});

  ipcRenderer.once('maitre_douvrage:modifier', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_MAITRE_DOUVRAGE"
  });
  if(data){
    dispatch({
        type : "MODIFIER_MAITRE_DOUVRAGE",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_MAITRE_DOUVRAGE",
      payload : data
  });
  }
});
    
}
}