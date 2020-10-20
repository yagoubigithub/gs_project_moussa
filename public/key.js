const { app,  ipcMain } =  require("electron");
const db = require('./db')
const mainWindow = require('./mainWindow');


const methode = Key.prototype;

function Key(){
//db.run('DROP TABLE key');

    db.run(`CREATE TABLE IF NOT EXISTS key (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT,
        date TEXT
       
    )`);
    
   

     //get user
     ipcMain.on("key", (event, value) => {
       
        db.all(
            `SELECT * FROM key WHERE  id=1 `,
            function(err, rows) {
              if (err) mainWindow.webContents.send("key", err);
              mainWindow.webContents.send("key", rows);
            }
          );
      
      });

         //add key
     ipcMain.on("key:ajouter", (event, value) => {
       if(value.key){
         db.run("    UPDATE `key` SET key=? WHERE id=1" , [
           value.key
         ],function(err){
          if (err) mainWindow.webContents.send("key:ajouter", err);
          db.all(
            `SELECT * FROM key WHERE  id=1 `,
            function(err, rows) {
              if (err) mainWindow.webContents.send("key:ajouter", err);
              mainWindow.webContents.send("key:ajouter", rows);
            }
          );
         })
       }
       
     
    
    });


}


module.exports = Key;

