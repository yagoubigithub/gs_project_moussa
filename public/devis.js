const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = Devis.prototype;

function Devis() {
  // db.run('DROP TABLE devis');
  // db.run('DROP TABLE devis_phases_projets');

  db.run(`CREATE TABLE IF NOT EXISTS devis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id INTEGER,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT,
    duree_phase INTEGER ,
    prix_totale  INTEGER ,
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
      `INSERT INTO devis(projet_id  , nom , objet , adresse  , duree_phase , prix_totale , remise, date_devis ,  maitreDouvrage_id , status) VALUES (${value.projet_id},'${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} , '${value.date_devis}' , ${value.maitreDouvrage_id} , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("devis:ajouter", err);

        
        //add phase de devis
        const devis_id = this.lastID;
        let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , status) VALUES   `;

        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${devis_id},'${phase.value.id}' , 'undo') ,`;
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
          if (err) mainWindow.webContents.send("devis:ajouter", err);
          ReturnAllDevis()
          .then((projets) =>
            mainWindow.webContents.send("devis:ajouter", projets)
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
    `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.delais},'${value.date_debut}','${value.date_depot}' , 'en cours',${value.duree_phase},${value.maitreDouvrage_id} , 'undo') `,
    function (err) {
      if (err) mainWindow.webContents.send("devis:transform", err);

      //add phase de projet
      const projet_id = this.lastID;
      console.log("projet_id = ",projet_id)
      let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , status) VALUES   `;

      value.phasesProjetsSelected.forEach((phase) => {
        const placeholder = ` (${projet_id},'${phase.value}' , 'undo') ,`;
        sql = sql + placeholder;
      });

      sql = sql.slice(0, sql.lastIndexOf(",") - 1);

      db.run(sql, function (err) {
        if (err) mainWindow.webContents.send("devis:transform", err);

        db.run(
          `
                 UPDATE devis SET projet_id=${projet_id}  WHERE id=${value.id} `

                 ,function(err){

                  ReturnAllDevis()
                  .then((projets) => mainWindow.webContents.send("devis:transform", projets))
                  .catch((err) => mainWindow.webContents.send("devis:transform", err));
                 });




     
      });

     
    
    }
  );

 });

  ipcMain.on("devis:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

      db.run(
        `UPDATE devis  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("devis:delete", err);

          ReturnAllDevis()
            .then((deviss) =>
              mainWindow.webContents.send("devis:delete", deviss)
            )
            .catch((err) => mainWindow.webContents.send("devis:delete", err));
        }
      );
    }
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
      `SELECT d.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM devis d  JOIN maitre_douvrage m ON m.id=d.maitreDouvrage_id ORDER BY id DESC`,
      function (err, rows) {
        if (err) reject(err);
        if (rows !== undefined) {
          if (rows.length === 0) {
            resolve(deviss);
          } else {
            rows.forEach((devis) => {
              db.all(
                `SELECT *  FROM devis_phases_projets WHERE devis_id=${devis.id}`,
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
