
import queryString from 'query-string';



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

export const addKey = (key) =>{

  return (dispatch ,getState)=>{


    dispatch({
      type : "LOADING_KEY"
  })



  fetch('https://atech-info.com/atech-api/testKey.php', {
        method: 'POST', // or 'PUT'
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: queryString.stringify({key}),
      })
      .then(response => { console.log(response.body);return response.text()})

      .then(key_response => {
        console.log(key_response)
        dispatch({
          type : "STOP_LOADING_KEY"
      });
      try {
         const obj = JSON.parse(key_response);
      
          
     
        if(obj.key){
          
          
          ipcRenderer.send("key:ajouter", {key : obj.key});
    
          ipcRenderer.once('key:ajouter', function (event,data) {
           
            dispatch({
              type : "STOP_LOADING_KEY"
          });
          console.log(data)
          if(data){
            dispatch({
                type : "AJOUTER_KEY",
                payload : data,
            });
          }else{
            dispatch({
              type : "ERROR_KEY",
              payload : data
          });
          }
      });


        }else{
          dispatch({
            type : "ERROR_KEY",
            payload : "clé invalid"
        });
        }
      } catch (error) {
        dispatch({
          type : "ERROR_KEY",
          payload : "clé invalid"
      });
      }
   
      })



}}