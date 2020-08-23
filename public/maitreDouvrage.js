const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = MaitreDouvrage.prototype;

function MaitreDouvrage() {
 db.run('DROP TABLE maitre_douvrage');

  db.run(`CREATE TABLE IF NOT EXISTS maitre_douvrage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT ,
    raison_social TEXT ,
    rg TEXT , 
    telephone TEXT,
    email TEXT,
    adresse TEXT,
   logo TEXT ,
   status TEXT
)`);

  //get
  ipcMain.on("maitre_douvrage", (event, value) => {
    if(value.id){
      db.get("SELECT * FROM maitre_douvrage WHERE id="+value.id, function (err, result) {
        if (err) mainWindow.webContents.send("maitre_douvrage", err);
        mainWindow.webContents.send("maitre_douvrage", result);
      });
    }else{
       db.all("SELECT * FROM maitre_douvrage ", function (err, rows) {
      if (err) mainWindow.webContents.send("maitre_douvrage", err);
      mainWindow.webContents.send("maitre_douvrage", rows);
    });
    }
   
  });

  //AJOUTER
  ipcMain.on("maitre_douvrage:ajouter", (event, value) => {
    if (value.nom !== undefined) {
      db.run(
        `
               INSERT INTO maitre_douvrage(nom , prenom , raison_social , rg , telephone , email , adresse , logo,status) VALUES (?,?,?,?,?,?,?,?, ?) `,
               [
                value.nom,
                value.prenom , 
                value.raison_social , 
                value.rg  ,
                value.telephone , 
                value.email , 
                value.adresse , 
                value.logo ,
                'undo'



               ],
        function (err) {
          if (err) mainWindow.webContents.send("maitre_douvrage:ajouter", err);
          db.all("SELECT * FROM maitre_douvrage ", function (err, rows) {
            if (err)
              mainWindow.webContents.send("maitre_douvrage:ajouter", err);
            mainWindow.webContents.send("maitre_douvrage:ajouter", rows);
          });
        }
      );

      /*
                
                              */
    }
  });



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


  ipcMain.on("maitre_douvrage:delete-multi", (event, value) => {
    let sql = `UPDATE maitre_douvrage  SET status='${
      value.status
    }' WHERE id IN(${value.maitre_douvrages.join(",")})    `;
    db.run(sql, function (err) {

      if (err) mainWindow.webContents.send("maitre_douvrage:delete-multi", err);
      db.all( `SELECT * FROM maitre_douvrage ORDER BY id`, function (err, rows) {
        if (err) mainWindow.webContents.send("maitre_douvrage:delete-multi", err);
        
       
        mainWindow.webContents.send("maitre_douvrage:delete-multi", rows);
      });

     
    });
  });

  
  //MODIFIER
  ipcMain.on("maitre_douvrage:modifier", (event, value) => {
    if (value.nom !== undefined) {
      db.run(
        `
               UPDATE maitre_douvrage SET nom=?, prenom=?, raison_social=?, rg=?, telephone=?, email=?, adresse=?, logo=?  WHERE id=? `,
               [
                value.nom , 
                value.prenom , 
                value.raison_social , 
                value.rg ,
                value.telephone ,
                value.email ,

                value.adresse ,

                value.logo ,
                value.id







               ]
               ,
        function (err) {
          if (err) mainWindow.webContents.send("maitre_douvrage:modifier", err);

          console.log(err)
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
module.exports = MaitreDouvrage;
