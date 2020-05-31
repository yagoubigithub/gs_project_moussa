const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = Devis.prototype;

function Devis() {
 //db.run('DROP TABLE devis');
// db.run('DROP TABLE devis_phases_projets');

  db.run(`CREATE TABLE IF NOT EXISTS devis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT,
    duree_phase INTEGER ,
    prix_totale    INTEGER ,
    remise INTEGER,
    date_devis TEXT,
    maitreDouvrage_id INTEGER ,
   status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS devis_phases_projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  devis_id INTEGER NOT NULL,
  phases_devis_id INTEGER NOT NULL,
 status TEXT
)`);

  //get
  ipcMain.on("devis", (event, value) => {
    if (value.id) {
      db.get(
        "SELECT d.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM devis d  JOIN maitre_douvrage m ON m.id=d.maitreDouvrage_id WHERE id=" +
          value.id,
        function (err, result) {
          if (err) mainWindow.webContents.send("devis", err);
          mainWindow.webContents.send("devis", result);
        }
      );
    } else {
      ReturnAllDevis()
        .then((projets) => mainWindow.webContents.send("devis", projets))
        .catch((err) => mainWindow.webContents.send("devis", err));
    }
  });

  
  //AJOUTER
  ipcMain.on("devis:ajouter", (event, value) => {
      
    const deviss = [];
    db.run(
      `INSERT INTO devis(nom , objet , adresse  , duree_phase , prix_totale , remise, date_devis ,  maitreDouvrage_id , status) VALUES ('${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} , '${value.date_devis}' , ${value.maitreDouvrage_id} , 'undo') `,
      function (err) {
       
        if (err) mainWindow.webContents.send("devis:ajouter", err);

        //add phase de devis
        const devis_id = this.lastID;
        let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , status) VALUES   `;

        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${devis_id},'${phase.value}' , 'undo') ,`;
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
          if (err) mainWindow.webContents.send("devis:ajouter", err);
        });

        ReturnAllDevis()
        .then((projets) => mainWindow.webContents.send("devis:ajouter", projets))
        .catch((err) => mainWindow.webContents.send("devis:ajouter", err));
      }
    );

    /*
                
                              */
  });

  ipcMain.on("devis:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

      db.run(
        `UPDATE devis  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("devis:delete", err);

       
          ReturnAllDevis()
          .then((deviss) => mainWindow.webContents.send("devis:delete", deviss))
          .catch((err) => mainWindow.webContents.send("devis:delete", err));
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
            mainWindow.webContents.send("maitre_douvrage:modifier", {
              maitreDouvrages: rows,
              maitreDouvrage: value,
            });
          });
        }
      );

      /*
                
                              */
    }
  });
}
function ReturnAllDevis() {
  const deviss = [];

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT d.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM devis d  JOIN maitre_douvrage m ON m.id=d.maitreDouvrage_id `,
      function (err, rows) {
        if (err) reject(err);
        if(rows !== undefined){
          if(rows.length === 0){
            resolve(deviss);
          }else{
            rows.forEach((devis) => {
              db.all(
                `SELECT *  FROM devis_phases_projets WHERE devis_id=${devis.id}`,
                function (err, devis_phases_projets) {
                
                
                    deviss.push({ devis_phases_projets: [...devis_phases_projets], ...devis });
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
