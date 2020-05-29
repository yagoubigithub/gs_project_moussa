const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = Projet.prototype;

function Projet() {
 // db.run('DROP TABLE projet');
 // db.run('DROP TABLE phases_projets');

  db.run(`CREATE TABLE IF NOT EXISTS projet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT ,
    delais INTEGER ,
    date_debut TEXT ,
    date_depot TEXT ,
    etat TEXT ,
    duree_phase INTEGER ,
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
    if (value.id) {
      db.get(
        "SELECT p.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM projet p  JOIN maitre_douvrage m ON m.id=p.maitreDouvrage_id WHERE id=" +
          value.id,
        function (err, result) {
          if (err) mainWindow.webContents.send("projet", err);
          mainWindow.webContents.send("projet", result);
        }
      );
    } else {
      ReturnAllProject()
        .then((projets) => mainWindow.webContents.send("projet", projets))
        .catch((err) => mainWindow.webContents.send("projet", err));
    }
  });

  
  //AJOUTER
  ipcMain.on("projet:ajouter", (event, value) => {
    const projets = [];
    db.run(
      `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.delais},'${value.date_debut}','${value.date_depot}' , 'en cours',${value.duree_phase},${value.maitreDouvrage_id} , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("projet:ajouter", err);

        //add phase de projet
        const projet_id = this.lastID;
        let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , status) VALUES   `;

        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${projet_id},'${phase.value}' , 'undo') ,`;
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
          if (err) mainWindow.webContents.send("projet:ajouter", err);
        });

        ReturnAllProject()
        .then((projets) => mainWindow.webContents.send("projet:ajouter", projets))
        .catch((err) => mainWindow.webContents.send("projet:ajouter", err));
      }
    );

    /*
                
                              */
  });

  ipcMain.on("projet:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

      db.run(
        `UPDATE projet  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("projet:delete", err);

       
          ReturnAllProject()
          .then((projets) => mainWindow.webContents.send("projet:delete", projets))
          .catch((err) => mainWindow.webContents.send("projet:delete", err));
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
function ReturnAllProject() {
  const projets = [];

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT p.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM projet p  JOIN maitre_douvrage m ON m.id=p.maitreDouvrage_id `,
      function (err, rows) {
        if (err) reject(err);
        if(rows !== undefined){
          if(rows.length === 0){
            resolve(projets);
          }else{
            rows.forEach((projet) => {
              db.all(
                `SELECT *  FROM phases_projets WHERE projet_id=${projet.id}`,
                function (err, phases_projets) {
                  projets.push({ phases_projets: [...phases_projets], ...projet });
                  if (projets.length === rows.length) resolve(projets);
                }
              );
            });
          }
  
        }
     
        
      }
    );
  });
}
module.exports = Projet;
