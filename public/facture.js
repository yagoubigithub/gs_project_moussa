const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = Facture.prototype;

function Facture() {
  db.run('DROP TABLE facture');
  db.run('DROP TABLE facture_phases_projets');
  db.run('DROP TABLE paye');

  db.run(`CREATE TABLE IF NOT EXISTS facture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id INTEGER,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT,
    duree_phase INTEGER ,
    prix_totale  REAL ,
    remise REAL,
    date_facture TEXT,
    maitreDouvrage_id INTEGER ,
    tva REAL,
   status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS facture_phases_projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facture_id INTEGER NOT NULL,
  phases_facture_id INTEGER NOT NULL,
 status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS paye (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facture_id INTEGER NOT NULL,
    paye REAL 
  )`);

  //get
  ipcMain.on("facture", (event, value) => {
    if (value.id) {
      const factures = [];

      db.all(
        `SELECT f.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM facture f   JOIN maitre_douvrage m ON m.id=f.maitreDouvrage_id   WHERE f.id=${value.id}`,
        function (err, factures_rows) {
          console.log(err);
          if (err) mainWindow.webContents.send("facture", err);
          if (factures_rows !== undefined) {
            if (factures_rows.length === 0) {
              mainWindow.webContents.send("facture", {});
            } else {
              factures_rows.forEach((facture) => {
                let paye = [],
                  facture_phases_projets = [];
                db.all(
                  `SELECT *  FROM facture_phases_projets WHERE facture_id=${facture.id} ORDER BY id DESC`,
                  function (err, rows) {
                    if (rows !== undefined) {
                      facture_phases_projets = [...rows];

                      new Promise((resolve, reject) => {
                        let phases = [];
                        for (
                          let i = 0;
                          i < facture_phases_projets.length;
                          i++
                        ) {
                          const facture_phase = facture_phases_projets[i];

                          db.get(
                            `SELECT * FROM phases_projet WHERE id=${facture_phase.phases_facture_id} `,
                            function (err, phase) {
                              if (err)
                                mainWindow.webContents.send("facture", err);

                              phases.push(phase);
                              if (
                                phases.length === facture_phases_projets.length
                              ) {
                                phases.sort((a, b) => {
                                  let comparison = 0;
                                  if (a.id > b.id) {
                                    comparison = 1;
                                  } else if (a.id < b.id) {
                                    comparison = -1;
                                  }
                                  return comparison;
                                });

                                resolve(phases);
                              }
                            }
                          );
                        }
                      }).then((phases) => {
                        db.all(
                          `SELECT *  FROM paye WHERE facture_id=${facture.id} ORDER BY id DESC`,
                          function (err, rows) {
                            if (rows !== undefined) {
                              paye = [...rows];

                              factures.push({
                                ...facture,
                                phases,
                                payeObject: paye,
                                paye: paye.reduce(
                                  (total, num) => (toal = total + num.paye),
                                  0
                                ),
                              });
                              if (factures.length === factures_rows.length)
                                mainWindow.webContents.send(
                                  "facture",
                                  factures[0]
                                );
                            }
                          }
                        );
                      });
                    }
                  }
                );
              });
            }
          }
        }
      );
    } else {
      ReturnAllFacture()
        .then((factures) => mainWindow.webContents.send("facture", factures))
        .catch((err) => mainWindow.webContents.send("facture", err));
    }
  });

  //AJOUTER
  ipcMain.on("facture:ajouter", (event, value) => {
    const factures = [];
    
    console.log(value)

    //ajouter projet
    db.run(
      `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , remise  , tva ,  status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.delais},'${value.date_debut}','${value.date_depot}' , 'en cours',${value.duree_phase},${value.maitreDouvrage_id} , ${value.remise}  ,  ${value.tva} , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("facture:ajouter", err);

        console.log("ajouter projet",err)
        //add phase de projet
        const projet_id = this.lastID;
        
        let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , status) VALUES   `;

        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${projet_id},'${phase.value}' , 'undo') ,`;
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
          if (err) mainWindow.webContents.send("facture:ajouter", err);
          
          db.run(
            `INSERT INTO devis(projet_id  ,nom , objet , adresse  , duree_phase , prix_totale , remise, date_devis ,  maitreDouvrage_id ,  tva , status) VALUES (${projet_id},'${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} , '${value.date_facture}' , ${value.maitreDouvrage_id} , ${value.tva}  , 'undo') `,
            function (err) {
              if (err) mainWindow.webContents.send("facture:ajouter", err);
             
      
              //add phase de devis
              const devis_id = this.lastID;
              let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , status) VALUES   `;
      
              
            
              value.phasesProjetsSelected.forEach((phase) => {
                const placeholder = ` (${devis_id},'${phase.value.id}' , 'undo') ,`;
                sql = sql + placeholder;
              });
      
              sql = sql.slice(0, sql.lastIndexOf(",") - 1);
      
              db.run(sql, function (err) {
                if (err) mainWindow.webContents.send("facture:ajouter", err);

              
                
             //ajouter facture 
        
 //ajouter facture
 db.run(
  `INSERT INTO facture(projet_id  , nom , objet , adresse  , duree_phase , prix_totale , remise, date_facture ,  maitreDouvrage_id , tva , status) VALUES (${projet_id},'${value.nom}','${value.objet}','${value.adresse}' ,${value.duree_phase}, ${value.prix_totale}, ${value.remise} , '${value.date_facture}' , ${value.maitreDouvrage_id} , ${value.tva} , 'undo') `,
  function (err) {
    if (err) mainWindow.webContents.send("facture:ajouter", err);
  
    //add phase de facture
    const facture_id = this.lastID;

    db.run(
      `INSERT INTO paye(facture_id  , paye  ) VALUES (${facture_id},${value.paye} ) `,
      function (err) {
        if (err) mainWindow.webContents.send("facture:ajouter", err);

        let sql = `INSERT INTO facture_phases_projets(facture_id , phases_facture_id , status) VALUES   `;

        /*phases_facture_id:
         */

        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (${facture_id},'${phase.value.id}' , 'undo') ,`;
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql, function (err) {
         

          if (err) mainWindow.webContents.send("facture:ajouter", err);
          ReturnAllFacture()
            .then((factures) =>
              mainWindow.webContents.send("facture:ajouter", factures)
            )
            .catch((err) =>
              mainWindow.webContents.send("facture:ajouter", err)
            );
        });
      }
    );
  }
);

              });
             
            }
          );
        });

       
      
      }
    );

   

    /*
                
                              */
  });


  ipcMain.on('facture:ajouterPaiement', (event , value)=>{

    if(value.facture_id){
      db.run(
        `INSERT INTO paye(facture_id  , paye ) VALUES (${value.facture_id},${value.paye}) `,
        function (err) {
          if (err) mainWindow.webContents.send("facture:ajouterPaiement", err);
          ReturnAllFacture()
          .then((factures) =>
            mainWindow.webContents.send("facture:ajouterPaiement", factures)
          )
          .catch((err) =>
            mainWindow.webContents.send("facture:ajouterPaiement", err)
          );
        }
      )
    }
  


  })

  //AJOUTER
  ipcMain.on("devis:transform", (event, value) => {
    db.run(
      `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , remise , unite_remise , status) VALUES ('${value.nom}','${value.objet}','${value.adresse}',${value.delais},'${value.date_debut}','${value.date_depot}' , 'en cours',${value.duree_phase},${value.maitreDouvrage_id} , ${value.remise} , '${value.unite_remise}' , 'undo') `,
      function (err) {
        if (err) mainWindow.webContents.send("devis:transform", err);

        //add phase de projet
        const projet_id = this.lastID;

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

  ipcMain.on("devis:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet

      db.run(
        `UPDATE devis  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("devis:delete", err);

          ReturnAllDevis()
            .then((factures) =>
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
function ReturnAllFacture() {
  const factures = [];

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT f.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom  FROM facture f   JOIN maitre_douvrage m ON m.id=f.maitreDouvrage_id  ORDER BY f.id DESC `,
      function (err, factures_rows) {
        console.log(err);
        if (err) reject(err);
        if (factures_rows !== undefined) {
          if (factures_rows.length === 0) {
            resolve(factures);
          } else {
            factures_rows.forEach((facture) => {
              let paye = [],
                facture_phases_projets = [];
              db.all(
                `SELECT *  FROM facture_phases_projets WHERE facture_id=${facture.id} ORDER BY id DESC`,
                function (err, rows) {
                  if (rows !== undefined) {
                    facture_phases_projets = [...rows];
                  }

                  db.all(
                    `SELECT *  FROM paye WHERE facture_id=${facture.id} ORDER BY id DESC`,
                    function (err, rows) {
                      if (rows !== undefined) {
                        paye = [...rows];

                        factures.push({
                          ...facture,
                          facture_phases_projets,
                          payeObject: paye,
                          paye: paye.reduce(
                            (total, num) => (toal = total + num.paye),
                            0
                          ),
                        });
                        if (factures.length === factures_rows.length)
                          resolve(factures);
                      }
                    }
                  );
                }
              );
            });
          }
        }
      }
    );
  });
}
module.exports = Facture;
