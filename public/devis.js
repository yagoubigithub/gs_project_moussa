const { ipcMain , screen , BrowserWindow } = require("electron");

const db = require("./db");
const mainWindow = require("./mainWindow");

const isDev = require("electron-is-dev");
const methode = Devis.prototype;

function Devis() {
 db.run('DROP TABLE devis');
 db.run('DROP TABLE devis_phases_projets');

  db.run(`CREATE TABLE IF NOT EXISTS devis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id INTEGER,
    user_id INTEGER,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT,
    duree_phase INTEGER ,
    prix_totale  REAL ,
    remise REAL,
    date_devis TEXT,
    maitreDouvrage_id INTEGER ,
    tva REAL,
    
   status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS devis_phases_projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  devis_id INTEGER NOT NULL,
  phases_devis_id INTEGER NOT NULL,
  titre TEXT,
  description TEXT,
  duree INTEGER ,
  prix REAL ,
 status TEXT
)`);

  //get
  ipcMain.on("devis", (event, value) => {
    if (value.id) {
      let devis = {};
      db.get(
        "SELECT d.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom,m.rg maitre_douvrage_rg , m.raison_social maitre_douvrage_raison_social,m.telephone maitre_douvrage_telephone , m.email   maitre_douvrage_email, m.adresse maitre_douvrage_adresse ,m.logo maitre_douvrage_logo , u.nom user_nom , u.prenom user_prenom FROM devis d  JOIN maitre_douvrage m ON m.id=d.maitreDouvrage_id JOIN user u ON u.id=d.user_id WHERE d.id=" +
          value.id ,
        function (err, result) {
          if(err) mainWindow.webContents.send("devis", err);
          db.get(`SELECT * FROM  maitre_douvrage WHERE id=${result.maitreDouvrage_id}` , (err,maitreDouvrage)=>{
           

          if (err) mainWindow.webContents.send("devis", err);
          devis = { ...result,maitreDouvrage };
          const phases = [];
          db.all
          (
            `SELECT *  FROM devis_phases_projets WHERE devis_id=${value.id} ORDER BY phases_devis_id `,
            function (err, devis_phases_projets) {
             
              
             
              if (devis_phases_projets !== undefined) {
                devis.phases = [...devis_phases_projets];
               
                mainWindow.webContents.send("devis", devis)
              }else{
                devis.phases= []
                mainWindow.webContents.send("devis", devis)
              }
            }
          );

        })
        }
      );
    } else {
      ReturnAllDevis()
        .then((deviss) => mainWindow.webContents.send("devis", deviss))
        .catch((err) => mainWindow.webContents.send("devis", err));
    }
  });

  //AJOUTER
  ipcMain.on("devis:ajouter", (event, value) => {
    const deviss = [];
    db.run(
      `INSERT INTO devis(projet_id , user_id  , nom , objet , adresse  , duree_phase , prix_totale , remise , date_devis ,  maitreDouvrage_id , tva , status) VALUES (${value.projet_id}, ${value.user_id} , '${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} ,  '${value.date_devis}' , ${value.maitreDouvrage_id} , ${value.tva} , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("devis:ajouter", err);
       
        //add phase de devis
        const devis_id = this.lastID;
       
        let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , titre , description , duree , prix , status) VALUES   `;

        /*phases_devis_id:
        */
       
        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${devis_id},${phase.id} ,  '${phase.titre}' , '${phase.description}' , ${phase.duree} , ${phase.prix}  , 'undo') ,`;

          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
       
         

          if (err) mainWindow.webContents.send("devis:ajouter", err);
          ReturnAllDevis()
            .then((deviss) =>
              mainWindow.webContents.send("devis:ajouter", deviss)
            )
            .catch((err) => mainWindow.webContents.send("devis:ajouter", err));
        });
      }
    );

    /*
                
                              */
  });

  //AJOUTER
  ipcMain.on("devis:transform", (event, value) => {
    db.run(
      `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , user_id , remise  , status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.delais},'${value.date_debut}','${value.date_depot}' , 'en cours',${value.duree_phase},${value.maitreDouvrage_id} , ${value.user_id} , ${value.remise} , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("devis:transform", err);

        //add phase de projet
        const projet_id = this.lastID;
       
        let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , titre ,description , duree , prix , status) VALUES   `;
          
        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${projet_id},${phase.id} ,  '${phase.titre}' , '${phase.description}' , ${phase.duree} , ${phase.prix}  , 'undo') ,`;
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
          if (err) mainWindow.webContents.send("devis:transform", err);

          db.run(
            `
                 UPDATE devis SET projet_id=${projet_id}  WHERE id=${value.id} `,

            function (err) {
              ReturnAllDevis()
                .then((projets) =>
                  mainWindow.webContents.send("devis:transform", projets)
                )
                .catch((err) =>
                  mainWindow.webContents.send("devis:transform", err)
                );
            }
          );
        });
      }
    );
  });

 
  //get Phases
  ipcMain.on("phaseProjetDevis:get", (event, value) => {
    if (Object.keys(value).length > 0) {
      const phases = [];
      const promise = new Promise((resolve, reject) => {
        Object.keys(value).map((key) => {
          db.get(
            `SELECT * FROM phases_projet WHERE id=${value[key].phases_devis_id}`,
            function (err, result) {
              if (err) reject(err);
              phases.push(result);
              if (phases.length === Object.keys(value).length) resolve(phases);
            }
          );
        });
      })
        .then((phases) => {
          mainWindow.webContents.send("phaseProjetDevis:get", phases);
        })
        .catch((err) => {
          mainWindow.webContents.send("phaseProjetDevis:get", err);
        });
    } else {
      mainWindow.webContents.send("phaseProjetDevis:get", []);
    }
  });

  
  ipcMain.on("devis:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

    

      db.run(
        `UPDATE projet  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("devis:delete", err);
          db.run(` UPDATE devis  SET status='${value.status}' WHERE projet_id = ${value.id};`,
          function (err) {
            if (err) mainWindow.webContents.send("devis:delete", err);
            db.run(` UPDATE facture  SET status='${value.status}' WHERE projet_id = ${value.id};`,
            function (err) {
              if (err) mainWindow.webContents.send("devis:delete", err);

              ReturnAllDevis()
              .then((projets) => {
                mainWindow.webContents.send("devis:delete", projets);
              })
              .catch((err) => {
                mainWindow.webContents.send("devis:delete", err);
              });
            })
          })

        
        }
      );
    }
  });


  //MODIFIER
  ipcMain.on("devis:modifier", (event, value) => {
    if (value.projet_id !== 0) {

     
  db.run(
        `UPDATE projet SET nom='${value.nom}', objet='${value.objet}', adresse='${value.adresse}' , duree_phase=${value.duree_phase}  , maitreDouvrage_id=${value.maitreDouvrage_id} , remise=${value.remise} ,  prix_totale=${value.prix_totale} , tva=${value.tva} , status='${value.status}'  WHERE id=${value.projet_id} `,
        function (err) {
          if (err) mainWindow.webContents.send("devis:modifier", err);

console.log(err)
   db.run(`DELETE FROM phases_projets
   WHERE projet_id=${value.projet_id}` , (err)=>{
    if (err) mainWindow.webContents.send("devis:modifier", err);



    
    new Promise((resolve, reject)=>{
      let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , titre ,description , duree , prix , status) VALUES   `;
      let count = 0;
    
      value.phasesProjetsSelected.forEach((phase) => {
      
        const placeholder = ` (${value.projet_id},${phase.id} ,  '${phase.titre}' , '${phase.description}' , ${phase.duree} , ${phase.prix}  , 'undo') ,`;
        sql = sql + placeholder;
        count++;

        if(count === value.phasesProjetsSelected.length) {resolve(sql)}
      })
    }).then((sql)=>{
     
      sql = sql.slice(0, sql.lastIndexOf(",") - 1);
     
      db.run(sql, function (err) {
        if (err) mainWindow.webContents.send("devis:modifier", err);
      // modifier facture

db.get(`SELECT id  FROM facture WHERE projet_id=${value.projet_id}` ,  (err,result)=>{
  if (err) mainWindow.webContents.send("devis:modifier", err);

 const facture_id = result.id;

 db.run(
  `UPDATE facture SET nom='${value.nom}', objet='${value.objet}', adresse='${value.adresse}' , duree_phase=${value.duree_phase}  , prix_totale=${value.prix_totale}   , maitreDouvrage_id=${value.maitreDouvrage_id} , remise=${value.remise}  , tva=${value.tva} , status='${value.status}'  WHERE projet_id=${value.projet_id} `,
   (err) =>{
    if (err) mainWindow.webContents.send("devis:modifier", err);
    
   

db.run(`DELETE FROM facture_phases_projets
WHERE facture_id=${facture_id};` , (err)=>{
if (err) mainWindow.webContents.send("devis:modifier", err);





new Promise((resolve, reject)=>{
let sql = `INSERT INTO facture_phases_projets(facture_id , phases_facture_id , titre ,description , duree , prix , status) VALUES   `;
let count = 0;

value.phasesProjetsSelected.forEach((phase) => {

  const placeholder = ` (${facture_id},${phase.id} ,  '${phase.titre}' , '${phase.description}' , ${phase.duree} , ${phase.prix}  , 'undo') ,`;
  sql = sql + placeholder;
  count++;

  if(count === value.phasesProjetsSelected.length) {resolve(sql)}
})

}).then((sql)=>{

sql = sql.slice(0, sql.lastIndexOf(",") - 1);

db.run(sql, function (err) {

 
  if (err) mainWindow.webContents.send("devis:modifier", err);

//modfier devis



db.get(`SELECT id  FROM devis WHERE projet_id=${value.projet_id}` ,  (err,result)=>{
  if (err) mainWindow.webContents.send("devis:modifier", err);

 const devis_id = result.id;

 
 db.run(
  `UPDATE devis SET nom='${value.nom}', objet='${value.objet}', adresse='${value.adresse}' , duree_phase=${value.duree_phase}  , prix_totale=${value.prix_totale} , maitreDouvrage_id=${value.maitreDouvrage_id} , remise=${value.remise}  , tva=${value.tva} , status='${value.status}'  WHERE projet_id=${value.projet_id} `,
   (err) =>{
    if (err) mainWindow.webContents.send("devis:modifier", err);
    
   

db.run(`DELETE FROM devis_phases_projets
WHERE devis_id=${devis_id};` , (err)=>{
if (err) mainWindow.webContents.send("devis:modifier", err);





new Promise((resolve, reject)=>{
let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , titre ,description , duree , prix , status) VALUES   `;
let count = 0;

value.phasesProjetsSelected.forEach((phase) => {

  const placeholder = ` (${devis_id},${phase.id} ,  '${phase.titre}' , '${phase.description}' , ${phase.duree} , ${phase.prix}  , 'undo') ,`;
  sql = sql + placeholder;
  count++;

  if(count === value.phasesProjetsSelected.length) {resolve(sql)}
})

}).then((sql)=>{

sql = sql.slice(0, sql.lastIndexOf(",") - 1);

db.run(sql, function (err) {

 
  if (err) mainWindow.webContents.send("devis:modifier", err);

  ReturnAllDevis()
  .then((deviss) =>
    mainWindow.webContents.send("devis:modifier", {deviss , devis : value})
  )
  .catch((err) => mainWindow.webContents.send("devis:modifier", err));
})

})
})
   })
  })




  


})

})




})

  })
} )

   



      })


    })

   })


        }
      );

      /*
                
                              */
    }else{

     // edit devis without project

     db.run(
      `UPDATE devis SET nom='${value.nom}', objet='${value.objet}', adresse='${value.adresse}' , duree_phase=${value.duree_phase}  , prix_totale=${value.prix_totale} , maitreDouvrage_id=${value.maitreDouvrage_id} , remise=${value.remise}  , tva=${value.tva} , status='${value.status}'  WHERE id=${value.id} `,
       (err) =>{
        if (err) mainWindow.webContents.send("devis:modifier", err);
        
       
    
    db.run(`DELETE FROM devis_phases_projets
    WHERE devis_id=${value.id};` , (err)=>{
    if (err) mainWindow.webContents.send("devis:modifier", err);
    
    
    
    
    
    new Promise((resolve, reject)=>{
    let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , titre ,description , duree , prix , status) VALUES   `;
    let count = 0;
    
    value.phasesProjetsSelected.forEach((phase) => {
    
      const placeholder = ` (${value.id},${phase.id} ,  '${phase.titre}' , '${phase.description}' , ${phase.duree} , ${phase.prix}  , 'undo') ,`;
      sql = sql + placeholder;
      count++;
    
      if(count === value.phasesProjetsSelected.length) {resolve(sql)}
    })
    
    }).then((sql)=>{
    
    sql = sql.slice(0, sql.lastIndexOf(",") - 1);
    
    db.run(sql, function (err) {
    
     
      if (err) mainWindow.webContents.send("devis:modifier", err);
    
      ReturnAllDevis()
      .then((deviss) =>
        mainWindow.webContents.send("devis:modifier", {deviss , devis : value})
      )
      .catch((err) => mainWindow.webContents.send("devis:modifier", err));
    })
    
    })
    })
       })

    }
  });

 //search
 ipcMain.on("search:devis", (event, value) => {
  


const searchWindow = require('./search')  


let index = 0;
  let mainWindow_Bounds = BrowserWindow.getAllWindows()[0].getBounds()
  searchWindow.setBounds({x : mainWindow_Bounds.x + 50, y : mainWindow_Bounds.y + 50})

  searchWindow.show()

  ipcMain.on('search-text' ,  (event, value)=>{
   
    
    mainWindow.webContents.unselect()
    if(value.text == ""){
      mainWindow.webContents.stopFindInPage('clearSelection')
    }else{
  
      index =  mainWindow.webContents.findInPage(value.text, {
        
       
      })
    
      mainWindow.webContents.once('found-in-page', (event, result) => {
      
       
          const matches = result.matches;
          mainWindow.webContents.stopFindInPage('keepSelection')
          searchWindow.webContents.send("matches", {matches,index})
        

       
      })
     
    
      
    }

  })


  ipcMain.on('backward-search' ,  (event, value)=>{
    mainWindow.webContents.unselect()
   
    if(value.text == ""){
      mainWindow.webContents.stopFindInPage('clearSelection')
    }else{
  
      index =  mainWindow.webContents.findInPage(value.text, {
       
        forward : false
       
      })
      mainWindow.webContents.once('found-in-page', (event, result) => {
        if (result.finalUpdate){
          const matches = result.matches;
          searchWindow.webContents.send("matches", {matches,index})
        }

       
      })
     

  
  
  
  
    }
  })

  ipcMain.on('forward-search' ,  (event, value)=>{
 
    mainWindow.webContents.unselect()
   
    if(value.text == ""){
      mainWindow.webContents.stopFindInPage('clearSelection')
    }else{
  
      index =  mainWindow.webContents.findInPage(value.text, {
       
        forward : true
       
      })
      mainWindow.webContents.once('found-in-page', (event, result) => {
        if (result.finalUpdate){
          const matches = result.matches;
          searchWindow.webContents.send("matches", {matches,index})
        }

       
      })
     

  
  
  
  
    }
  
  })
/*
  if(value.text == ""){
    mainWindow.webContents.stopFindInPage('clearSelection')
  }else{

    mainWindow.webContents.findInPage(value.text, {
      forward  : true
    })
  
    mainWindow.webContents.send('search:devis' ,  {found : true})
  }
  */
 


});

}
function ReturnAllDevis() {
  const deviss = [];

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT d.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom , u.nom user_nom , u.prenom user_prenom  FROM devis d  JOIN maitre_douvrage m ON m.id=d.maitreDouvrage_id JOIN user u ON u.id=d.user_id ORDER BY id DESC`,
      function (err, rows) {
        if (err) reject(err);
        if (rows !== undefined) {
          if (rows.length === 0) {
            resolve(deviss);
          } else {
            rows.forEach((devis) => {
              db.all(
                `SELECT *  FROM devis_phases_projets WHERE devis_id=${devis.id} ORDER BY id DESC`,
                function (err, devis_phases_projets) {
                  if (devis_phases_projets !== undefined) {
                    deviss.push({
                      devis_phases_projets: [...devis_phases_projets],
                      ...devis,
                    });
                  }
                  if (deviss.length === rows.length) resolve(deviss);
                }
              );
            });
          }
        }
      }
    );
  });
}

module.exports = Devis;
