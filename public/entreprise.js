const {   ipcMain } =  require("electron");
const db = require('./db');
const mainWindow = require('./mainWindow');


const methode = Entreprise.prototype;

function Entreprise(){
 //Entreprise

 // db.run('DROP TABLE entreprise');

  db.run(`CREATE TABLE IF NOT EXISTS entreprise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    telephone TEXT,
    email TEXT,
    adresse TEXT
   
)`);


  //get entrepise
  ipcMain.on("entreprise", (event, value) => {
    db.all("SELECT * FROM entreprise ", function(err, rows) {
      if (err) mainWindow.webContents.send("entreprise", err);
      mainWindow.webContents.send("entreprise", rows);
    });
  });

  //AJOUTER entreprise
  ipcMain.on("entreprise:ajouter", (event, value) => {
     
    if (value.entreprise !== undefined) {
      // ajouter
      db.run(
        `
               INSERT INTO entreprise(nom  , telephone , email , adresse ) VALUES ('${value.entreprise.nom}','${value.entreprise.telephone}','${value.entreprise.email}','${value.entreprise.adresse}') `,
        function(err) {
          db.run(
            `
                INSERT INTO user(nom , prenom  , username ,  password , status  ) VALUES ('${value.user.nom}','${value.user.prenom}','${value.user.username}','${value.user.password}' , 'admin') `,
            function(err) {
              db.all("SELECT * FROM entreprise ", function(err, rows) {
                if (err) mainWindow.webContents.send("entreprise:ajouter", err);
                mainWindow.webContents.send("entreprise:ajouter", rows);
              });
            }
          );
        }
      );

      /*
                
                              */
    }
  });

  // modifier entreprise

  ipcMain.on("entreprise:modifier", (event, value) => {
    if (value.nom !== undefined) {
      // modifier

      db.run(
        `
     UPDATE entreprise SET nom='${value.nom}' , telephone='${value.telephone}' , email='${value.email}' , adresse='${value.adresse}'  WHERE  id=${value.id}  `,
        function(err) {
          if (err) mainWindow.webContents.send("entreprise:modifier", err);
          db.all("SELECT * FROM entreprise ", function(err, rows) {
            if (err) mainWindow.webContents.send("entreprise:modifier", err);
            mainWindow.webContents.send("entreprise:modifier", rows);
          });
        }
      );

      /*
      
                    */
    }
  });


   
}
module.exports = Entreprise;

