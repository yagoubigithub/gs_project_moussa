
const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = PhasesProjet.prototype;

function PhasesProjet() {
 //db.run('DROP TABLE phases_projet');




db.run(`CREATE TABLE IF NOT EXISTS phases_projet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT,
  description TEXT,
  duree INTEGER ,
 status TEXT
)`);


  //get
  ipcMain.on("phases_projet", (event, value) => {
    if(value.id){
      db.get(`SELECT ROW_NUMBER() OVER (
        ORDER BY id
       ) number,titre, description,id,duree,status FROM phases_projet WHERE id=${value.id}`, function (err, result) {
        if (err) mainWindow.webContents.send("phases_projet", err);
        mainWindow.webContents.send("phases_projet", result);
      });
    }else{
       db.all(`SELECT ROW_NUMBER() OVER (
        ORDER BY id
       ) number,titre, description,id,duree,status FROM phases_projet`, function (err, rows) {
      if (err) mainWindow.webContents.send("phases_projet", err);
      mainWindow.webContents.send("phases_projet", rows);
    });
    }
   
  });

  //AJOUTER
  ipcMain.on("phases_projet:ajouter", (event, value) => {
   console.log(value)
   
      db.run(
        `
               INSERT INTO phases_projet(titre , description , duree , status) VALUES ('${value.titre}','${value.description}' , ${value.duree} , 'undo') `,
        function (err) {
         
          if (err) mainWindow.webContents.send("phases_projet:ajouter", err);

         
        
          
          db.all( `SELECT ROW_NUMBER() OVER (
            ORDER BY id
           ) number,titre, description,id,duree,status FROM phases_projet`, function (err, rows) {
            if (err) mainWindow.webContents.send("phases_projet:ajouter", err);
            console.log(err,"gtrtgtget",rows)
            mainWindow.webContents.send("phases_projet:ajouter", rows);
          });
        }
      );

      /*
                
                              */
    
  });


  ipcMain.on("phases_projet:delete", (event, value) => {
    if (value.id !== undefined) {
      // get one maitre_douvrage

      db.run(
        `UPDATE phases_projet  SET status='${value.status}' WHERE id = ${value.id};`,
        function(err) {
          if (err) mainWindow.webContents.send("phases_projet:delete", err);

          db.all("SELECT * FROM phases_projet ORDER BY id DESC", function(
            err,
            rows
          ) {
            if (err) mainWindow.webContents.send("phases_projet:delete", err);
            mainWindow.webContents.send("phases_projet:delete", rows);
          });
        }
      );
    }
  });


  
  //MODIFIER
  ipcMain.on("phases_projet:modifier", (event, value) => {
    if (value.nom !== undefined) {
      db.run(
        `
               UPDATE phases_projet SET titre='${value.titre}', description='${value.description}' duree=${value.duree}  WHERE id=${value.id} `,
        function (err) {
          if (err) mainWindow.webContents.send("phases_projet:modifier", err);
          db.all("SELECT * FROM phases_projet ", function (err, rows) {
            if (err)
              mainWindow.webContents.send("phases_projet:modifier", err);
            mainWindow.webContents.send("phases_projet:modifier", {maitreDouvrages : rows, maitreDouvrage : value});
          });
        }
      );

      /*
                
                              */
    }
  });
}
module.exports = PhasesProjet;
