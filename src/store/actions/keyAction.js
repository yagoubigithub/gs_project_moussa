
const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const getKey = (data) =>{
    return (dispatch ,getState)=>{

    
    ipcRenderer.send("key");
    
    ipcRenderer.once('key', function (event,data) {
      
    
    if(Array.isArray(data)){
      dispatch({
        type : "GET_KEY",
        payload : data
    });
    }else{
      dispatch({
        type : "KEY_ERROR",
        payload : data
    });
    }
      
    });
   
    
     
    }
}