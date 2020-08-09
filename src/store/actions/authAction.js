const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const connexion = (data) =>{
    return (dispatch ,getState)=>{

      dispatch({
        type : "LOADING_AUTH"
    })
    ipcRenderer.send("user", {...data});
    
    ipcRenderer.once('user', function (event,data) {
      dispatch({
        type : "STOP_LOADING_AUTH"
    });
    console.log(data);
    if(data[0] !== undefined){
      dispatch({
        type : "AUTH_SUCCESS",
        payload : {
         ...data[0]
        }
    });
    }else{
      dispatch({
        type : "AUTH_ERROR",
        payload : "username ou mot de passe invalid"
    });
    }
      
    });
   
    
     
    }
}

export const modifier_user  = (data) =>{
  return (dispatch,getState) =>{
    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("auth:modifier", {...data});

  ipcRenderer.once('auth:modifier', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  if(Array.isArray(data.users)){
    dispatch({
        type : "MODIFIER_AUTH",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_AUTH",
      payload : data
  });
  }
});

ipcRenderer.once('auth:modifier-2', function (event,data) {
   
  dispatch({
    type : "STOP_LOADING_AUTH"
});
if(Array.isArray(data.users)){
  dispatch({
      type : "MODIFIER_AUTH_2",
      payload : data
  });
}else{
  dispatch({
    type : "ERROR_AUTH",
    payload : data
});
}
});

  
  }
}


export const removeUserEdited = () =>{
  return (dispatch ,getState)=>{
    dispatch({type :  "REMOVE_USER_EDITED"})
  }
}

export const ajouterUser = (data) =>{
  return (dispatch, getState)  =>{
    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user:ajouter", {...data});

  ipcRenderer.once('user:ajouter', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_AUTH"
  });dispatch({
    type : "STOP_LOADING_AUTH"
});
  if(Array.isArray(data)){
    dispatch({
        type : "AJOUTER_AUTH",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_AUTH",
      payload : data.error
  });
  }
});

  }
}



export const removeUserCreated = (data) =>{
  return (dispatch, getState)  =>{
    dispatch({
      type : "REMOVE_USER_CREATED"
  })
  }}

export const getAllUser  = () =>{
  return (dispatch, getState)=>{

    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user", {});
  
  ipcRenderer.once('user', function (event,data) {
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  
  if(Array.isArray(data)){
    dispatch({
      type : "GET_ALL_USERS",
      payload : data
  });
  }else{
    dispatch({
      type : "AUTH_ERROR",
      payload : data
  });
  }
    
  });
 
  
  }
}


export const getUser = (id) =>{
  return (dispatch, getState)=>{

    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user", {id});
  
  ipcRenderer.once('user', function (event,data) {
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  
  if(data.id){
    dispatch({
      type : "GET_ONE_USER",
      payload : data
  });
  }else{
    dispatch({
      type : "AUTH_ERROR",
      payload : data
  });
  }
    
  });

}
}
//delete (mettre dans le corbeille)
export const addToCorbeille = (id) =>{
  return (dispatch , getState)=>{

    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user:delete", {id, status :  "corbeille"});

  ipcRenderer.once('user:delete', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "ADD_TO_CORBEILLE_AUTH",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_AUTH",
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
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user:delete-multi", {...data, status :  "corbeille"});

  ipcRenderer.once('user:delete-multi', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "ADD_TO_CORBEILLE_AUTH",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_AUTH",
      payload :data
  });
  }
});
    

  }
}


//undo delete
export const undoDeleteUser = (id) =>{
  return (dispatch ,getState)=>{

    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user:delete", {id, status :  "undo"});

  ipcRenderer.once('user:delete', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "UNDO_DELETE_AUTH",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_AUTH",
      payload :data
  });
  }
});

  }
}


//undo delete
export const undoDeleteUserMultiple = (data) =>{
  return (dispatch ,getState)=>{

    dispatch({
      type : "LOADING_AUTH"
  })
  ipcRenderer.send("user:delete-multi", {...data, status :  "undo"});

  ipcRenderer.once('user:delete-multi', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_AUTH"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "UNDO_DELETE_AUTH",
        payload : data
    });
  }else{
    dispatch({
      type : "ERROR_AUTH",
      payload :data
  });
  }
});

  }
}