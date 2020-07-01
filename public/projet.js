const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");
var os = require("os");

const methode = Projet.prototype;

function Projet() {
 //  db.run('DROP TABLE projet');
 //   db.run('DROP TABLE phases_projets');

  db.run(`CREATE TABLE IF NOT EXISTS projet (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT ,
    delais INTEGER ,
    date_debut TEXT ,
    date_depot TEXT ,
    etat TEXT ,
    duree_phase INTEGER ,
    maitreDouvrage_id INTEGER ,
    remise REAL,
    tva REAL,
   status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS phases_projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projet_id INTEGER NOT NULL,
  phases_projet_id INTEGER NOT NULL,
  titre TEXT,
  description TEXT,
  duree INTEGER ,
  prix REAL ,
 status TEXT
)`);

  //get
  ipcMain.on("projet", (event, value) => {
    if (value.id) {
      db.get(
        "SELECT p.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM projet p  JOIN maitre_douvrage m ON m.id=p.maitreDouvrage_id WHERE p.id=" +
          value.id,
        function (err, result) {
          
          if (err) mainWindow.webContents.send("projet", err);
          db.get(`SELECT * FROM  maitre_douvrage WHERE id=${result.maitreDouvrage_id}` , (err,maitreDouvrage)=>{
            if(err) mainWindow.webContents.send("projet", err);
            db.all(`SELECT * FROM phases_projets WHERE projet_id=${result.id}`, (err,rows)=>{
              if (err) mainWindow.webContents.send("projet", err);
  
              if(rows.length !== 0){
                let sql = 'SELECT * FROM phases_projet WHERE '
                sql = sql +  rows.map(phase=>  {  return `id=${phase.phases_projet_id}` }).join(' OR ')
                
               
                db.all(sql, (err, rows) =>{
                  if(err)   mainWindow.webContents.send("projet", err);
                  mainWindow.webContents.send("projet", {...result,phasesProjets : rows,maitreDouvrage});
                })
              }else{
                mainWindow.webContents.send("projet", {...result,phasesProjets : [],maitreDouvrage});
              }
             
             
            });
          })

          
        
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
    db.run(
      `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , remise  , tva ,  status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.delais},'${value.date_debut}','${value.date_depot}' , 'en cours',${value.duree_phase},${value.maitreDouvrage_id} , ${value.remise} ,   ${value.tva} , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("projet:ajouter", err);

        //add phase de projet
        const projet_id = this.lastID;

      

        new Promise((resolve, reject)=>{
          let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , titre ,description , duree , prix , status) VALUES   `;
          let count = 0;
        
          value.phasesProjetsSelected.forEach((phase) => {
          
            const placeholder = ` (${projet_id},${phase.value.id} ,  '${phase.value.titre}' , '${phase.value.description}' , ${phase.value.duree} , ${phase.value.prix}  , 'undo') ,`;
            sql = sql + placeholder;
            count++;

            if(count === value.phasesProjetsSelected.length) {resolve(sql)}
          })
        }).then((sql)=>{
         
          sql = sql.slice(0, sql.lastIndexOf(",") - 1);
          console.log(sql)
          db.run(sql, function (err) {
            if (err) mainWindow.webContents.send("projet:ajouter", err);
            console.log(err)
  
            db.run(
              `INSERT INTO devis(projet_id  ,nom , objet , adresse  , duree_phase , prix_totale , remise, date_devis ,  maitreDouvrage_id ,  tva , status) VALUES (${projet_id},'${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} , '${value.date_projet}' , ${value.maitreDouvrage_id} , ${value.tva}  , 'undo') `,
              function (err) {
                if (err) mainWindow.webContents.send("projet:ajouter", err);
  
                //add phase de devis
                const devis_id = this.lastID;
                let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , titre ,description , duree , prix , status) VALUES   `;
  
                value.phasesProjetsSelected.forEach((phase) => {
                  const placeholder = ` (${devis_id},'${phase.value.id}' ,  '${phase.value.titre}' , '${phase.value.description}' , ${phase.value.duree} , ${phase.value.prix} , 'undo') ,`;
                  sql = sql + placeholder;
                });
  
                sql = sql.slice(0, sql.lastIndexOf(",") - 1);
  
                db.run(sql, function (err) {
                  if (err) mainWindow.webContents.send("projet:ajouter", err);
  
                  //ajouter facture
                  db.run(
                    `INSERT INTO facture(projet_id  , nom , objet , adresse  , duree_phase , prix_totale , remise, date_facture ,  maitreDouvrage_id , tva , status) VALUES (${projet_id},'${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} , '${value.date_projet}' , ${value.maitreDouvrage_id} , ${value.tva} , 'undo') `,
                    function (err) {
                      if (err) mainWindow.webContents.send("projet:ajouter", err);
  
                      //add phase de facture
                      const facture_id = this.lastID;
  
                      let sql = `INSERT INTO facture_phases_projets(facture_id , phases_facture_id , titre ,description , duree , prix , status) VALUES   `;
  
                      /*phases_facture_id:
                       */
  
                      value.phasesProjetsSelected.forEach((phase) => {
                        const placeholder = ` (${facture_id},'${phase.value.id}' ,  '${phase.value.titre}' , '${phase.value.description}' , ${phase.value.duree} , ${phase.value.prix} , 'undo') ,`;
                        sql = sql + placeholder;
                      });
  
                      sql = sql.slice(0, sql.lastIndexOf(",") - 1);
  
                      db.run(sql, function (err) {
                        if (err)
                          mainWindow.webContents.send("projet:ajouter", err);
  
                        ReturnAllProject()
                          .then((projets) =>
                            mainWindow.webContents.send("projet:ajouter", projets)
                          )
                          .catch((err) =>
                            mainWindow.webContents.send("projet:ajouter", err)
                          );
                      });
                    }
                  );
                });
              }
            );
          });
        })
      

       
      }
    );

    /*
                
                              */
  });

  ipcMain.on("projet:fini", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

    

      db.run(
        `UPDATE projet  SET etat='fini' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("projet:fini", err);

          ReturnAllProject()
            .then((projets) => {
              mainWindow.webContents.send("projet:fini", projets);
            })
            .catch((err) => {
              mainWindow.webContents.send("projet:fini", err);
            });
        }
      );
    }
  });



  ipcMain.on("projet:undo-fini", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

      db.run(
        `UPDATE projet  SET etat='en cours' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("projet:undo-fini", err);

          ReturnAllProject()
            .then((projets) => {
              mainWindow.webContents.send("projet:undo-fini", projets);
            })
            .catch((err) => {
              mainWindow.webContents.send("projet:undo-fini", err);
            });
        }
      );
    }
  });




  ipcMain.on("projet:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

      console.log(value.id);

      db.run(
        `UPDATE projet  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("projet:delete", err);

          ReturnAllProject()
            .then((projets) => {
              mainWindow.webContents.send("projet:delete", projets);
            })
            .catch((err) => {
              mainWindow.webContents.send("projet:delete", err);
            });
        }
      );
    }
  });

  ipcMain.on("projet:delete-multi", (event, value) => {
    let sql = `UPDATE projet  SET status='${
      value.status
    }' WHERE id IN(${value.projets.join(",")})    `;
    db.run(sql, function (err) {
      if (err) mainWindow.webContents.send("projet:delete-multi", err);
      console.log(err);

      ReturnAllProject()
        .then((projets) => {
          mainWindow.webContents.send("projet:delete-multi", projets);
        })
        .catch((err) => {
          mainWindow.webContents.send("projet:delete-multi", err);
        });
    });
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
      `SELECT p.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM projet p  JOIN maitre_douvrage m ON m.id=p.maitreDouvrage_id  ORDER BY p.id DESC`,
      function (err, rows) {
        if (err) reject(err);
        if (rows !== undefined) {
          if (rows.length === 0) {
            resolve(projets);
          } else {
            rows.forEach((projet) => {
              db.all(
                `SELECT *  FROM phases_projets WHERE projet_id=${projet.id}`,
                function (err, phases_projets) {
                  if (phases_projets !== undefined)
                    projets.push({
                      phases_projets: [...phases_projets],
                      ...projet,
                    });
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
