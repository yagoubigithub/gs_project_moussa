const { ipcMain, dialog } = require("electron");
const db = require("./db");
const mainWindow = require("./mainWindow");
const converter = require("json-2-csv");
const fs = require("fs");
//utils
const { getCurrentDateTime } = require("./utils/methods");
const methode = Entreprise.prototype;

function Entreprise() {
  //Entreprise

 //db.run('DROP TABLE entreprise');

  db.run(`CREATE TABLE IF NOT EXISTS entreprise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    rc TEXT,
    nif TEXT,
    nis TEXT,
    na TEXT
   
)`);

  //get entrepise
  ipcMain.on("entreprise", (event, value) => {
    db.all("SELECT * FROM entreprise ", function (err, rows) {
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
               INSERT INTO entreprise(nom  , telephone , email , adresse ,rc , nis , nif , na) VALUES (?,?,?,? ,?,?,?,?) `,
               [
                value.entreprise.nom,
                value.entreprise.telephone,
                value.entreprise.email,
                value.entreprise.adresse,
                value.entreprise.rc,
                value.entreprise.nis,
                value.entreprise.nif,
                value.entreprise.na
               ]
               , 
        function (err) {
          if (err) mainWindow.webContents.send("entreprise:ajouter", err);
          db.run(
            `
                INSERT INTO user(nom , prenom  , username ,  password , status  ) VALUES (?,?,?,? ,? ) `,
                [
                  value.user.nom,
                  value.user.prenom,
                  value.user.username,
                  value.user.password,
                  'admin'



                ]
                , 
            function (err) {
              if (err) mainWindow.webContents.send("entreprise:ajouter", err);


              db.run(`
              INSERT INTO key( key , date   ) VALUES (?,?) `,
              [
                "",
                getCurrentDateTime(new Date().getTime())
                ,
              



              ]
              , 
          function (err) {
            if (err) mainWindow.webContents.send("entreprise:ajouter", err);
             db.all("SELECT * FROM entreprise ", function (err, rows) {
                if (err) mainWindow.webContents.send("entreprise:ajouter", err);
                mainWindow.webContents.send("entreprise:ajouter", rows);
              });
          })

             
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
     UPDATE entreprise SET nom=? , telephone=? , email=? , adresse=? , rc=? , nis=? , nif=? , na=?  WHERE  id=?  `,
[
  value.nom ,
  value.telephone, 
  value.email , 
  value.adresse , 
  value.rc ,
  value.nis , 
  value.nif  ,
  value.na  ,

  value.id



]
     ,
        function (err) {
          if (err) mainWindow.webContents.send("entreprise:modifier", err);
          db.all("SELECT * FROM entreprise ", function (err, rows) {
            if (err) mainWindow.webContents.send("entreprise:modifier", err);
            mainWindow.webContents.send("entreprise:modifier", rows);
          });
        }
      );

      /*
      
                    */
    }
  });

  //export
  ipcMain.on("_export", (event, value) => {
    generateCSV();
  });

  //IMPORT
  ipcMain.on("_import", (event, value) => {
    const tables = [
      "projet",
      "phases_projets",
      "devis",
      "devis_phases_projets",
      "facture",
      "facture_phases_projets",
      "paye",
      "maitre_douvrage",
      "phases_projet",
      "user",
    ];

    dialog
      .showOpenDialog(mainWindow, {
        properties: [  "openFile","openDirectory", "promptToCreate", "showHiddenFiles"],
      })
      .then((result) => {
        if (!result.canceled) {
          const path = `${result.filePaths}`;

          new Promise((resolve, reject) => {
            let count = 0;

            tables.forEach((table) => {
              if (fs.existsSync(`${path}/${table}.csv`)) {
                console.log("exists : ", table);
                count++;
                if (count === tables.length) {
                  resolve();
                }
              } else {
                reject("les fichiers n'existent pas");
              }
            });
          })
            .then(() => {
              // get data

              new Promise((resolve, reject) => {
                let count = 0;
                const csv_s = [];
                tables.forEach((table) => {
                  fs.readFile(`${path}/${table}.csv`, "utf-8", (err, data) => {
                    if (err) {
                      reject(
                        "An error ocurred reading the file :" + err.message
                      );
                      return;
                    }

                    csv_s.push({
                      name: table,
                      value: data,
                    });

                    count++;
                    if (count === tables.length) resolve(csv_s);
                  });
                });
              })
                .then((csv_s) => {
                  new Promise((resolve, reject) => {
                    const json_s = [];
                    csv_s.forEach((csv) => {
                      converter.csv2json(
                        csv.value,
                        (err, array) => {
                          if (err) reject(err);

                          json_s.push({
                            name: csv.name,
                            value: array,
                          });

                          if (json_s.length === csv_s.length) {
                            resolve(json_s);
                          }
                        },
                        {
                          delimiter: {
                            field: ";",
                          },
                        }
                      );
                    });
                  })
                    .then((json_s) => {
                      let count = 0;
                      let count_tables_undifiend = 0;

                      new Promise((resolve, reject) => {
                       
                        json_s.forEach((json) => {
                          const data = json.value;
                        
                          if (data[0]) {
                            const keys = Object.keys(data[0]);
                            let sql = `INSERT INTO ${json.name}  (`;
                            keys.forEach((key) => {
                              sql = sql + ` ${key},`;
                            });

                            sql = sql.substr(0, sql.length - 1);
                            sql = sql + ") VALUES ";
                            const options = [];
                            data.forEach((row) => {
                              sql = sql + "(";
                              keys.forEach((key) => {
                                sql = sql + `?,`;
                                options.push(row[key]);
                              });

                              sql = sql.substr(0, sql.length - 1);
                              sql = sql + "),";
                            });
                            sql = sql.substr(0, sql.length - 1);

                            db.run(`DELETE FROM ${json.name}`, (err) => {
                              if (err) reject(err);
                              db.run(sql, options, (err) => {
                                if (err) reject(err);
                                count++;
                                console.log("add one table");
                                if (count + count_tables_undifiend === json_s.length) resolve();
                              });
                            });
                          }else{
                            count_tables_undifiend++;
                          }
                        });
                      })
                        .then(() => {
                          console.log("success");
                          mainWindow.webContents.send("_import", {
                            _import: true,
                          });
                        })
                        .catch((err) => {
                          console.log(err, 1);
                          mainWindow.webContents.send("_import", err);
                        });
                    })
                    .catch((err) => {
                      console.log(err, 2);
                      mainWindow.webContents.send("_import", err);
                    });
                })
                .catch((err) => {
                  console.log(err, 3);
                  mainWindow.webContents.send("_import", err);
                });
            })
            .catch((err) => {
              console.log(err, 4);
              mainWindow.webContents.send("_import", err);
            });
        }else{
          mainWindow.webContents.send("_import", { _import: true });
        }
      });
  });
}

function generateCSV() {
  const tables = [
    "projet",
    "phases_projets",
    "devis",
    "devis_phases_projets",
    "facture",
    "facture_phases_projets",
    "paye",
    "maitre_douvrage",
    "phases_projet",
    "user",
  ];

  const tables_columns = {
    projet: [],
    phases_projets: [],
    devis: [
      "id",
      "projet_id",
      "user_id",
      "nom",
      "objet",
      "adresse",
      "duree_phase",
      "prix_totale",
      "remise",
      "date_devis",
      "maitreDouvrage_id",
      "tva",

      "status",
    ],
    devis_phases_projets: [
      "id",
      "devis_id",
      "phases_devis_id",
      "titre",
      "description",
      "duree",
      "prix",
      "status",
    ],
    facture: [
      "id",
      "projet_id",
      "user_id",
      "nom",
      "objet",
      "adresse",
      "duree_phase",
      "prix_totale",
      "remise",
      "date_facture",
      "maitreDouvrage_id",
      "tva",
      "status",
    ],
    facture_phases_projets: [
      "id",
      "facture_id",
      "phases_facture_id",
      "titre",
      "description",
      "duree",
      "prix",
      "status",
    ],
    paye: ["id", "facture_id", "paye", "user_id", "date_paye"],
    maitre_douvrage: [
      "id",
      "nom",
      "prenom",
      "raison_social",
      "rg",
      "telephone",
      "email",
      "adresse",
      "logo",
      "status",
    ],
    phases_projet: [],
    user: [],
  };
  let count = 0;

  new Promise((resolve, reject) => {
    const json_s = [];
    tables.forEach((table) => {
      db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) reject(err);
        json_s.push({
          name: table,
          value: rows,
        });
        if (rows[0] == undefined || rows[0] == null) console.log(rows);
        count++;
        if (count === tables.length) resolve(json_s);
      });
    });
  })
    .then((json_s) => {
      dialog
        .showOpenDialog(mainWindow, {
          properties: [
            "openFile",
            "openDirectory",
            "promptToCreate",
            "showHiddenFiles",
          ],
        })
        .then((result) => {
          if (!result.canceled) {
            const d = getCurrentDateTime(new Date().getTime()).split("T")[0];
            const path = `${result.filePaths}/save-${d}`;
            fs.mkdir(path, (err) => {
              if (err) console.log(err);
              let count = 0;
              new Promise((resolve, reject) => {
                json_s.forEach((table) => {
                  converter.json2csv(
                    table.value,
                    (err, csv) => {
                      if (err) {
                        reject(err);
                      }
                      // write CSV to a file
                      fs.writeFile(`${path}/${table.name}.csv`, csv, (err) => {
                        if (err) reject(err);
                        console.log("finish : ", table.name);
                        count++;
                        if (count === json_s.length) resolve();
                      });
                    },
                    {
                      delimiter: {
                        field: ";",
                      },
                    }
                  );
                });
              })
                .then(() => {
                  mainWindow.webContents.send("_export", { _export: true });
                })
                .catch((err) => {
                  mainWindow.webContents.send("_export", err);
                });
            });
          }else{
            mainWindow.webContents.send("_export", { _export: false }); 
          }
        });
    })
    .catch((err) => mainWindow.webContents.send("_export", err));
}

module.exports = Entreprise;
