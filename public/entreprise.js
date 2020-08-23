const {   ipcMain , dialog} =  require("electron");
const db = require('./db');
const mainWindow = require('./mainWindow');
const converter = require('json-2-csv');
const fs = require('fs')
//utils
const {getCurrentDateTime } = require('./utils/methods')
const methode = Entreprise.prototype;

function Entreprise(){
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
    nis TEXT
   
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
               INSERT INTO entreprise(nom  , telephone , email , adresse ,rc , nis , nif) VALUES ('${value.entreprise.nom}','${value.entreprise.telephone}','${value.entreprise.email}','${value.entreprise.adresse}' ,'${value.entreprise.rc}','${value.entreprise.nis}','${value.entreprise.nif}') `,
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
     UPDATE entreprise SET nom='${value.nom}' , telephone='${value.telephone}' , email='${value.email}' , adresse='${value.adresse}' , rc='${value.rc}' , nis='${value.nis}' , nif='${value.nif}'  WHERE  id=${value.id}  `,
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



  //export
  ipcMain.on("_export", (event, value) => {

    generateCSV()
  })
   
  //IMPORT
 ipcMain.on("_import", (event, value) => {


})


}


 
 
function generateCSV  ()  {

  const tables = ["projet","phases_projets", "devis","devis_phases_projets", "facture","facture_phases_projets" , "paye","maitre_douvrage","phases_projet"]

  let count = 0;
  

  new Promise((resolve, reject)=>{
    const json_s = []
    tables.forEach((table) => {
   
db.all(`SELECT * FROM ${table}`, (err, rows)=>{

  if (err) reject(err)
  json_s.push({
    name : table,
    value : rows
  })
  count++;
  if(count === tables.length)
  resolve(json_s)
})
    
    });
  }).then(json_s=>{

    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'openDirectory' , 'promptToCreate' , 'showHiddenFiles']
    }).then(result => {
     
      if(!result.canceled){
        const d = getCurrentDateTime(new Date().getTime()).split('T')[0];
        const path = `${result.filePaths}/save-${d}`
        fs.mkdir(path, (err)=>{
          if(err) console.log(err)
          let count=0;
          new Promise((resolve, reject)=>{
  
            json_s.forEach(table => {
              converter.json2csv( table.value, 
                (err, csv) => {
                if (err) {
                    reject(err);
                }
                  // write CSV to a file
              fs.writeFile(`${path}/${table.name}.csv`, csv, (err)=>{
                if(err) reject(err)
                console.log("finish : ", table.name) 
                count++;
                if(count === json_s.length) resolve()
             
              });
              },{
                delimiter  : {
                  field  :";"
                }
              })
            });
          }).then(()=>{
            mainWindow.webContents.send("_export", {_export : true});
          }).catch(err=>{
            mainWindow.webContents.send("_export", err);
          })
        });
       



      }})


   


  }).catch(err=>mainWindow.webContents.send("_export", err))
 


}

module.exports = Entreprise;

