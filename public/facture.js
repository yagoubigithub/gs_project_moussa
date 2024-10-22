const { ipcMain } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");

const methode = Facture.prototype;

function Facture() {
// db.run('DROP TABLE facture');
// db.run('DROP TABLE facture_phases_projets');
// db.run('DROP TABLE paye');

  db.run(`CREATE TABLE IF NOT EXISTS facture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id INTEGER,
    user_id INTEGER,
    nom TEXT NOT NULL,
    objet TEXT,
    adresse TEXT,
    duree_phase INTEGER ,
    prix_totale  REAL ,
    remise REAL,
    date_facture TEXT,
    maitreDouvrage_id INTEGER ,
    tva REAL,
    ht INTEGER ,
   status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS facture_phases_projets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facture_id INTEGER NOT NULL,
  phases_facture_id INTEGER NOT NULL,
  titre TEXT,
  description TEXT,
  duree INTEGER ,
  prix REAL ,
 status TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS paye (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    facture_id INTEGER NOT NULL,
    paye REAL,
    user_id INTEGER,
    date_paye TEXT
  )`);

  //get
  ipcMain.on("facture", (event, value) => {
    if (value.id) {
      const factures = [];

      db.all(
        `SELECT f.*,p.date_depot date_depot, p.date_debut date_debut, p.delais delais , m.id maitreDouvrage_id,  m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom , m.rg maitre_douvrage_rg , m.raison_social maitre_douvrage_raison_social,m.telephone maitre_douvrage_telephone , m.email   maitre_douvrage_email, m.adresse maitre_douvrage_adresse ,m.logo maitre_douvrage_logo , u.nom user_nom , u.prenom user_prenom FROM facture f   JOIN maitre_douvrage m ON m.id=f.maitreDouvrage_id JOIN user u ON u.id=f.user_id JOIN projet p ON p.id=f.projet_id   WHERE f.id=${value.id}`,
        function (err, factures_rows) {
        
          if (err) mainWindow.webContents.send("facture", err);
          db.get(`SELECT * FROM  maitre_douvrage WHERE id=${factures_rows[0].maitreDouvrage_id}` , (err,maitreDouvrage)=>{

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
                        resolve(facture_phases_projets);
                      }).then((phases) => {
                        db.all(
                          `SELECT *  FROM paye WHERE facture_id=${facture.id} ORDER BY id DESC`,
                          function (err, rows) {
                            if (rows !== undefined) {
                              paye = [...rows];

                              factures.push({
                                ...facture,
                                phases,
                                maitreDouvrage,
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
          })

         
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
   
    //ajouter projet
    db.run(
      `INSERT INTO projet(nom , objet , adresse , delais , date_debut , date_depot , etat , duree_phase , maitreDouvrage_id , user_id , remise  , tva , ht,  status) VALUES (?,?,?,?,?,? , ?,?,? , ? , ?  , ? , ? , ?) `, 
      [
        value.nom,
        value.objet,
        value.adresse,
        value.delais,
        value.date_debut,
        value.date_depot,
        'en cours',
        value.duree_phase,
        value.maitreDouvrage_id,
        value.user_id,
        value.remise,
        value.tva,
        value.ht,
        'undo'
      ],
      function (err) {
        if (err) mainWindow.webContents.send("facture:ajouter", err);

     
        //add phase de projet
        const projet_id = this.lastID;
        
        let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , titre ,description , duree , prix , status) VALUES   `;

        const params = [];
        value.phasesProjetsSelected.forEach((phase) => {

          const placeholder = ` (?,? ,  ? , ? , ? , ? , ?) ,`;

          params.push(projet_id,phase.id,phase.titre,phase.description,phase.duree,phase.prix,'undo')

          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql,params, function (err) {
          if (err) mainWindow.webContents.send("facture:ajouter", err);
        
          db.run(
            `INSERT INTO devis(projet_id , user_id  , nom , objet , adresse  , duree_phase , prix_totale , remise , date_devis ,  maitreDouvrage_id ,  tva  , ht , status) VALUES (?,?,?,?,? ,?, ?, ? ,? , ? , ? ,?  ,?) `,

            [
              projet_id,
              value.user_id,
              value.nom,
              value.objet,
              value.adresse,
              value.duree_phase,
              value.prix_totale,
              value.remise,
              value.date_facture,
              value.maitreDouvrage_id,
              value.tva,
              value.ht,
              'undo'




            ],

            function (err) {
              if (err) mainWindow.webContents.send("facture:ajouter", err);
             
          
              //add phase de devis
              const devis_id = this.lastID;
              let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , titre ,description , duree , prix , status) VALUES   `;
            
              const params = []
              value.phasesProjetsSelected.forEach((phase) => {

                const placeholder = ` (?,? ,  ? , ? , ? , ? , ?) ,`;
                params.push(devis_id,phase.id,phase.titre,phase.description,phase.duree,phase.prix,'undo')
                sql = sql + placeholder;
              });
      
              sql = sql.slice(0, sql.lastIndexOf(",") - 1);
      
              db.run(sql ,params , function (err) {
                if (err) mainWindow.webContents.send("facture:ajouter", err);

                
                
             //ajouter facture 
        
 //ajouter facture
 db.run(
  `INSERT INTO facture(projet_id ,user_id  , nom , objet , adresse  , duree_phase , prix_totale , remise, date_facture ,  maitreDouvrage_id , tva , ht , status) VALUES (? ,?,?,?,? ,?, ?, ? , ? , ? , ? , ? , ?) `,

  [
    projet_id,
    value.user_id,

    value.nom,
    value.objet,
    value.adresse,
    value.duree_phase,
    value.prix_totale,
    value.remise,
    value.date_facture,
    value.maitreDouvrage_id,
    value.tva,
    value.ht,
    'undo'





  ],
  function (err) {
    if (err) mainWindow.webContents.send("facture:ajouter", err);
  
    //add phase de facture
    const facture_id = this.lastID;

    db.run(
      `INSERT INTO paye(facture_id  , paye , user_id , date_paye  ) VALUES (?,  ? , ?,  ? ) `,
      [
        facture_id,
        value.paye,
        value.user_id,
        value.date_facture

      ]
      ,
      function (err) {
        if (err) mainWindow.webContents.send("facture:ajouter", err);

        let sql = `INSERT INTO facture_phases_projets(facture_id , phases_facture_id , titre ,description , duree , prix , status) VALUES   `;
        /*phases_facture_id:
         */

         const params = []
        value.phasesProjetsSelected.forEach((phase) => {
          const placeholder = ` (?,? ,  ? , ? , ? , ? , ?) ,`;
          params.push(facture_id,phase.id,phase.titre,phase.description,phase.duree,phase.prix,'undo')
          sql = sql + placeholder;
        });

        sql = sql.slice(0, sql.lastIndexOf(",") - 1);

        db.run(sql,params, function (err) {
         
         
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
        `INSERT INTO paye(facture_id  , paye , user_id ,  date_paye ) VALUES (${value.facture_id} ,${value.paye} , ${value.user_id}  , '${value.date_paye}')  `,
        function (err) {
          if (err) mainWindow.webContents.send("facture:ajouterPaiement", err);
          ReturnAllEtatDuFacture()
          .then((etat_factures) =>
            mainWindow.webContents.send("facture:ajouterPaiement", etat_factures)
          )
          .catch((err) =>
            mainWindow.webContents.send("facture:ajouterPaiement", err)
          );
        }
      )
    }
  


  })


  



  //get Phases
  ipcMain.on("facture:etat", (event, value) => {
   
    ReturnAllEtatDuFacture()
        .then((factures) => mainWindow.webContents.send("facture:etat", factures))
        .catch((err) => mainWindow.webContents.send("facture:etat", err));

   

  });

 
  ipcMain.on("facture:statistique", (event, value) => {


    db.all(
      `SELECT strftime('%Y', p.date_paye) annee, SUM(p.paye) revenu FROM paye p JOIN facture f ON f.id=p.facture_id WHERE f.status="undo" GROUP BY annee ORDER BY annee; `,
      function (err, statistique) {

        if(err) mainWindow.webContents.send("facture:statistique", err)
      
        mainWindow.webContents.send("facture:statistique", statistique)
        
      })

  });

  ipcMain.on("facture:delete", (event, value) => {
    if (value.id !== undefined) {
      // delete  projet
      db.run(
        `UPDATE projet  SET status='${value.status}' WHERE id = ${value.id};`,
        function (err) {
          if (err) mainWindow.webContents.send("facture:delete", err);
          db.run(` UPDATE devis  SET status='${value.status}' WHERE projet_id = ${value.id};`,
          function (err) {
            if (err) mainWindow.webContents.send("facture:delete", err);
            db.run(` UPDATE facture  SET status='${value.status}' WHERE projet_id = ${value.id};`,
            function (err) {
              if (err) mainWindow.webContents.send("facture:delete", err);

              ReturnAllFacture()
              .then((fctures) => {
                mainWindow.webContents.send("facture:delete", factures);
              })
              .catch((err) => {
                mainWindow.webContents.send("facture:delete", err);
              });
            })
          })

        
        }
      );
    }
  });
  ipcMain.on("facture:delete-multi", (event, value) => {
    let sql = `UPDATE projet  SET status='${
      value.status
    }' WHERE id IN(${value.factures.join(",")})    `;
    db.run(sql, function (err) {
      if (err) mainWindow.webContents.send("facture:delete-multi", err);

      let sql = `UPDATE devis  SET status='${
        value.status
      }' WHERE projet_id IN(${value.factures.join(",")})    `;

      db.run(sql, function (err) {
        if (err) mainWindow.webContents.send("facture:delete-multi", err);

        let sql = `UPDATE facture  SET status='${
          value.status
        }' WHERE projet_id IN(${value.factures.join(",")})    `;
        db.run(sql, function (err) {
          if (err) mainWindow.webContents.send("facture:delete-multi", err);
          ReturnAllFacture()
          .then((factures) => {
            mainWindow.webContents.send("facture:delete-multi", factures);
          })
          .catch((err) => {
            mainWindow.webContents.send("facture:delete-multi", err);
          });
        })
      })
     

     
    });
  });


   //MODIFIER
   ipcMain.on("facture:modifier", (event, value) => {
    if (value.projet_id !== 0) {
     
     
  db.run(
        `UPDATE projet SET nom=?, objet=?, adresse=? , duree_phase=?  , maitreDouvrage_id=? , remise=? , date_debut=?, date_depot=? ,   tva=? , ht=? , status=?  WHERE id=? `,

        [
          value.nom , 
          value.objet ,
          value.adresse , 
          value.duree_phase , 
          value.maitreDouvrage_id , 
          value.remise ,
          value.date_debut ,
          value.date_depot , 
          value.tva ,
          value.ht ,
          value.status , 
          value.projet_id


        ],

        function (err) {
          if (err) mainWindow.webContents.send("facture:modifier", err);

         

   db.run(`DELETE FROM phases_projets
   WHERE projet_id=${value.projet_id}` , (err)=>{
    if (err) mainWindow.webContents.send("facture:modifier", err);
  
    new Promise((resolve, reject)=>{
      let sql = `INSERT INTO phases_projets(projet_id , phases_projet_id , titre ,description , duree , prix , status) VALUES   `;
      let count = 0;
    
      const params = [];
      value.phasesProjetsSelected.forEach((phase) => {
      
        const placeholder = ` (?,? ,  ? , ? , ? , ?  , ?) ,`;
        params.push(value.projet_id,phase.id,phase.titre,phase.description,phase.duree,phase.prix,'undo')

        sql = sql + placeholder;
        count++;

        if(count === value.phasesProjetsSelected.length) {resolve({sql, params})}
      })
    }).then(({sql, params})=>{
     
      sql = sql.slice(0, sql.lastIndexOf(",") - 1);
     
      db.run(sql, params,  function (err) {
        if (err) mainWindow.webContents.send("facture:modifier", err);
      // modifier facture

db.get(`SELECT id  FROM facture WHERE projet_id=${value.projet_id}` ,  (err,result)=>{
  if (err) mainWindow.webContents.send("facture:modifier", err);

 const facture_id = result.id;

 db.run(
  `UPDATE facture SET nom=?, objet=?, adresse=? , duree_phase=?  , prix_totale=?   , maitreDouvrage_id=? , remise=?  , tva=? , ht=? ,status=?  WHERE projet_id=? `,

  [
    value.nom,
    value.objet, 
    value.adresse , 
    value.duree_phase , 
    value.prix_totale , 
    value.maitreDouvrage_id ,
    value.remise , 
    value.tva , 
    value.ht , 
    value.status, 
    value.projet_id



  ],
   (err) =>{
    if (err) mainWindow.webContents.send("facture:modifier", err);
       

db.run(`DELETE FROM facture_phases_projets
WHERE facture_id=${facture_id};` , (err)=>{
if (err) mainWindow.webContents.send("facture:modifier", err);


new Promise((resolve, reject)=>{
let sql = `INSERT INTO facture_phases_projets(facture_id , phases_facture_id , titre ,description , duree , prix , status) VALUES   `;
let count = 0;

const params = []
value.phasesProjetsSelected.forEach((phase) => {

  const placeholder = ` (?,? ,  ? , ? , ? , ?  , ?) ,`;
  sql = sql + placeholder;
  count++;
  params.push(facture_id,phase.id,phase.titre,phase.description,phase.duree,phase.prix,'undo')
  if(count === value.phasesProjetsSelected.length) {resolve({sql,params})}
})

}).then(({sql, params})=>{

sql = sql.slice(0, sql.lastIndexOf(",") - 1);

db.run(sql,params, function (err) {

 
  if (err) mainWindow.webContents.send("facture:modifier", err);

//modfier devis



db.get(`SELECT id  FROM devis WHERE projet_id=${value.projet_id}` ,  (err,result)=>{
  if (err) mainWindow.webContents.send("facture:modifier", err);

 const devis_id = result.id;

 
 db.run(
  `UPDATE devis SET nom=?, objet=?, adresse=? , duree_phase=?  , prix_totale=? , maitreDouvrage_id=? , remise=?  , tva=?,ht=? , status=?  WHERE projet_id=? `,
  [
    value.nom,
    value.objet,
    value.adresse,
    value.duree_phase,
    value.prix_totale,
    value.maitreDouvrage_id , 
    value.remise , 
    value.tva , 
    value.ht , 
    value.status , 
    value.projet_id
  ],
   (err) =>{
    if (err) mainWindow.webContents.send("facture:modifier", err);
    
   

db.run(`DELETE FROM devis_phases_projets
WHERE devis_id=${devis_id};` , (err)=>{
if (err) mainWindow.webContents.send("facture:modifier", err);

new Promise((resolve, reject)=>{
let sql = `INSERT INTO devis_phases_projets(devis_id , phases_devis_id , titre ,description , duree , prix , status) VALUES   `;
let count = 0;

const params = [];

value.phasesProjetsSelected.forEach((phase) => {

  const placeholder = ` (?,? ,  ? , ? , ? , ?  , ?) ,`;
  sql = sql + placeholder;
  count++;
  params.push(devis_id,phase.id,phase.titre,phase.description,phase.duree,phase.prix,'undo')
  if(count === value.phasesProjetsSelected.length) {resolve({sql , params})}
})

}).then(({sql , params})=>{

sql = sql.slice(0, sql.lastIndexOf(",") - 1);

db.run(sql,params, function (err) {

 
  if (err) mainWindow.webContents.send("facture:modifier", err);

  ReturnAllFacture()
  .then((factures) =>
    mainWindow.webContents.send("facture:modifier", {factures , facture : value})
  )
  .catch((err) => mainWindow.webContents.send("facture:modifier", err));
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
    }
  });

}


function ReturnAllEtatDuFacture  () {
  const factures = [];
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT f.*,p.paye paiement , p.date_paye, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom , u.nom user_nom , u.prenom user_prenom FROM facture f   JOIN maitre_douvrage m ON m.id=f.maitreDouvrage_id LEFT  JOIN paye p ON f.id=p.facture_id JOIN user u ON u.id=f.user_id WHERE f.status="undo" ORDER BY f.id DESC `,
      function (err, factures_rows) {
       
       
        if (err) reject(err);
        if (factures_rows !== undefined) {
          if (factures_rows.length === 0) {
            resolve(factures);
          } else {
            for (let i = 0; i < factures_rows.length; i++) {
              const facture = factures_rows[i];
              let paye = [],
              facture_phases_projets = [];
            db.all(
              `SELECT *  FROM facture_phases_projets WHERE facture_id=${facture.id}`,
              function (err, rows) {
                if (rows !== undefined) {
                  facture_phases_projets = [...rows];
                }

                db.all(
                  `SELECT *  FROM paye WHERE facture_id=${facture.id} `,
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
            }
          
          }
        }
      }
    );
  });
}
function ReturnAllFacture() {
  const factures = [];

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT f.*, m.nom maitre_douvrage_nom , m.prenom maitre_douvrage_prenom , u.nom user_nom , u.prenom user_prenom  FROM facture f   JOIN maitre_douvrage m ON m.id=f.maitreDouvrage_id JOIN user u ON f.user_id=u.id  ORDER BY f.id DESC `,
      function (err, factures_rows) {
        
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
