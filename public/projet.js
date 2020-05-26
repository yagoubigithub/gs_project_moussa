const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = Projet.prototype;

function Projet() {
// db.run('DROP TABLE projet');


  db.run(`CREATE TABLE IF NOT EXISTS projet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT ,
    maitreDouvrage_id INTEGER ,
   status TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS phases_projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projet_id INTEGER NOT NULL,
  phases_projet_id INTEGER NOT NULL,
 status TEXT
)`);


  //get
  ipcMain.on("projet", (event, value) => {
    if(value.id){
      db.get("SELECT * FROM projet WHERE id="+value.id, function (err, result) {
        if (err) mainWindow.webContents.send("projet", err);
        mainWindow.webContents.send("projet", result);
      });
    }else{
       db.all(`SELECT * FROM projet `, function (err, rows) {
      if (err) mainWindow.webContents.send("projet", err);
      
      mainWindow.webContents.send("projet", rows);
    });
    }
   
  });

  //AJOUTER
  ipcMain.on("projet:ajouter", (event, value) => {
      db.run(
        `
               INSERT INTO projet(nom , objet , adresse , maitreDouvrage_id , status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.maitreDouvrage_id} , 'undo') `,
        function (err) {
         
          if (err) mainWindow.webContents.send("projet:ajouter", err);

          //add phase de projet
          const projet_id = this.lastID;
          value.phases_projets.forEach(phase => {
            db.run(
              `
                     INSERT INTO phase_projet(projet_id , phases_projet_id , status) VALUES (${projet_id},'${phase.id}' , 'undo') `,
              function (err) {
                if(err) mainWindow.webContents.send("projet:ajouter", err);
              })
          });
          
          
          db.all( `SELECT *  FROM projet `, function (err, rows) {
            if (err) mainWindow.webContents.send("projet:ajouter", err);
            mainWindow.webContents.send("projet:ajouter", rows);
          });
        }
      );

      /*
                
                              */
    
  });

  ipcMain.on('maitre_douvrage:logo', (event,value)=>{
    if(value.id){
      db.get(`SELECT logo FROM maitre_douvrage WHERE id=${value.id} `, function (err,result) {
        if (err) mainWindow.webContents.send("maitre_douvrage:logo", err);

        mainWindow.webContents.send("maitre_douvrage:logo", result.logo);

      })
    }
  })
  

  ipcMain.on("maitre_douvrage:delete", (event, value) => {
    if (value.id !== undefined) {
      // get one maitre_douvrage

      db.run(
        `UPDATE maitre_douvrage  SET status='${value.status}' WHERE id = ${value.id};`,
        function(err) {
          if (err) mainWindow.webContents.send("maitre_douvrage:delete", err);

          db.all("SELECT * FROM maitre_douvrage ORDER BY id DESC", function(
            err,
            rows
          ) {
            if (err) mainWindow.webContents.send("maitre_douvrage:delete", err);
            mainWindow.webContents.send("maitre_douvrage:delete", rows);
          });
        }
      );
    }
  });


  
  //MODIFIER
  ipcMain.on("maitre_douvrage:modifier", (event, value) => {
    if (value.nom !== undefined) {
      db.run(
        `
               UPDATE maitre_douvrage SET nom='${value.nom}', prenom='${value.prenom}', raison_social='${value.raison_social}', rg='${value.rg}', telephone='${value.telephone}', email='${value.email}', adresse='${value.adresse}', logo='${value.logo}'  WHERE id=${value.id} `,
        function (err) {
          if (err) mainWindow.webContents.send("maitre_douvrage:modifier", err);
          db.all("SELECT * FROM maitre_douvrage ", function (err, rows) {
            if (err)
              mainWindow.webContents.send("maitre_douvrage:modifier", err);
            mainWindow.webContents.send("maitre_douvrage:modifier", {maitreDouvrages : rows, maitreDouvrage : value});
          });
        }
      );

      /*
                
                              */
    }
  });

}
module.exports = Projet;
