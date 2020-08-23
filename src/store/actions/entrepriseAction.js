import queryString from 'query-string';
const electron = window.require("electron");
const {ipcRenderer}  = electron;

export const ajouterntreprise = (data) =>{
    return (dispatch ,getState)=>{

      dispatch({
        type : "LOADING_ENTREPRISE"
    })
      const key = { key : data.key };
  

      fetch('http://localhost:9093/atech-api/testKey.php', {
        method: 'POST', // or 'PUT'
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: queryString.stringify(key),
      })
      .then(response => { console.log(response.body);return response.text()})
      .then(key_response => {
       
        const obj = JSON.parse(key_response);
        
        if(obj.key){


          ipcRenderer.send("entreprise:ajouter", {...data});
    
          ipcRenderer.once('entreprise:ajouter', function (event,data) {
           
            dispatch({
              type : "STOP_LOADING_ENTREPRISE"
          });
          if(data){
            dispatch({
                type : "AJOUTER_ENTREPRISE",
                payload : data
            });
          }else{
            dispatch({
              type : "ERROR_ENTREPRISE",
              payload : data
          });
          }
      });
            
        }else{
          dispatch({
            type : "ERROR_ENTREPRISE",
            payload : "clé invalid"
        });
        }

      })

       
       
       
    }
}

export const getEtreprise = ()=>{
    return (dispatch,getState)=>{
      dispatch({
        type : "LOADING_ENTREPRISE"
    });
        ipcRenderer.send("entreprise", {});
    
        ipcRenderer.once('entreprise', function (event,data) {
         
          dispatch({
            type : "STOP_LOADING_ENTREPRISE"
        });
        console.log(data)
        if(Array.isArray(data)){
          dispatch({
              type : "GET_ONE_ENTREPRISE",
              payload : data[0]
          });
        }else{
          dispatch({
            type : "ERROR_ENTREPRISE",
            payload : data
        });
        }
    });
    }
}


export const modifierAgence  = (data) =>{
  return (dispatch,getState) =>{
    dispatch({
      type : "LOADING_ENTREPRISE"
  })
  ipcRenderer.send("entreprise:modifier", {...data});

  ipcRenderer.once('entreprise:modifier', function (event,data) {
   
    dispatch({
      type : "STOP_LOADING_ENTREPRISE"
  });
  if(Array.isArray(data)){
    dispatch({
        type : "MODIFIER_ENTREPRISE",
        payload : data[0]
    });
  }else{
    dispatch({
      type : "ERROR_ENTREPRISE",
      payload : data
  });
  }
});

  
  }
}
//removeEntrepriseError

export const removeEntrepriseError = ()=>{
  return (dispatch,getState)=>{
    dispatch({
      type : "REMOVE_ENTREPRISE_ERROR"
  });

}}


//export

export const _export = () =>{
  return (dispatch ,  getState) =>{
   
    
    dispatch({
      type : "LOADING_ENTREPRISE"
  })
  ipcRenderer.send("_export", {});

  ipcRenderer.once('_export', function (event,data) {

    dispatch({
      type : "STOP_LOADING_ENTREPRISE"
  });
  if(data._export){
    dispatch({
        type : "EXPORT_DATA"
    });
  }else{
    dispatch({
      type : "ERROR_ENTREPRISE",
      payload : data
  });
  }
  })
  }
}


//import

export const _import = () =>{
  return (dispatch ,  getState) =>{
   
    
    dispatch({
      type : "LOADING_ENTREPRISE"
  })
  ipcRenderer.send("_import", {});

  ipcRenderer.once('_import', function (event,data) {

    dispatch({
      type : "STOP_LOADING_ENTREPRISE"
  });
  if(data._import){
    dispatch({
        type : "IMPORT_DATA"
    });
  }else{
    dispatch({
      type : "ERROR_ENTREPRISE",
      payload : data
  });
  }
  })
  }
}