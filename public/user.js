const { app,  ipcMain } =  require("electron");
const db = require('./db')
const mainWindow = require('./mainWindow');


const methode = User.prototype;

function User(){

    db.run(`CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT ,
        password TEXT
       
    )`);
    
     //get user
     ipcMain.on("user", (event, value) => {
        db.all(
          `SELECT * FROM user WHERE username='${value.username}' AND password='${value.password}' AND id=1`,
          function(err, rows) {
            if (err) mainWindow.webContents.send("user", err);
            mainWindow.webContents.send("user", rows);
          }
        );
      });
}
module.exports = User;

