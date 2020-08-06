const { app,  ipcMain } =  require("electron");
const db = require('./db')
const mainWindow = require('./mainWindow');


const methode = User.prototype;

function User(){
// db.run('DROP TABLE user');

    db.run(`CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        prenom TEXT,
        username TEXT ,
        password TEXT ,
        status TEXT
       
    )`);
    
     //get user
     ipcMain.on("user", (event, value) => {
       if(Object.keys(value).length === 0){
        db.all(
          `SELECT * FROM user`,
          function(err, rows) {
            if (err) mainWindow.webContents.send("user", err);
            mainWindow.webContents.send("user", rows);
          }
        );
       }else
        db.all(
          `SELECT * FROM user WHERE username='${value.username}' AND password='${value.password}'  AND (status='undo' OR status='admin') `,
          function(err, rows) {
            if (err) mainWindow.webContents.send("user", err);
            mainWindow.webContents.send("user", rows);
          }
        );
      });


        ipcMain.on("user:ajouter", (event, value) => {
       if(Object.keys(value).length !== 0){
       
        db.all(
          `SELECT * FROM user WHERE username='${value.username}'  `,
          function(err, rows) {
            if (err) mainWindow.webContents.send("user:ajouter", {error : err});

            if(rows.length > 0){
              mainWindow.webContents.send("user:ajouter", {error : "Utilisateur déja exist"});
            }else{

              console.log(rows)
              db.run(
                `
                    INSERT INTO user(nom , prenom  , username ,  password , status  ) VALUES ('${value.nom}','${value.prenom}','${value.username}','${value.password}' , 'undo') `,
                function(err) {
                  if (err) mainWindow.webContents.send("user:ajouter", err);
                  db.all(
                    `SELECT * FROM user`,
                    function(err, rows) {
                      if (err) mainWindow.webContents.send("user:ajouter", err);
                      mainWindow.webContents.send("user:ajouter", rows);
                    }
                  );
                })
            
            }
           
          }
        );
       }
       
      });


      ipcMain.on("user:delete", (event, value)=>{
        if (value.id !== undefined) {
          // delete  projet
    
          console.log(value.id);
    
          db.run(
            `UPDATE user  SET status='${value.status}' WHERE id = ${value.id};`,
            function (err) {
              if (err) mainWindow.webContents.send("user:delete", err);
    

              ReturnAllUser()
                .then((users) => {
                  console.log(users)
                  mainWindow.webContents.send("user:delete", users);
                })
                .catch((err) => {
                  mainWindow.webContents.send("user:delete", err);
                });
            }
          );
        }
      })


      ipcMain.on("auth:modifier", (event, value)=>{
        console.log(value)
        if (value.id !== undefined) {
          // delete  projet
          db.run(
            `UPDATE user  SET nom='${value.nom}' ,  prenom='${value.prenom}' ,  username='${value.username}' ,  password='${value.password}'   WHERE id = ${value.id};`,
            function (err) {
              if (err) mainWindow.webContents.send("auth:modifier", err);
              db.all(
                `SELECT * FROM user`,
                function(err, rows) {
                  if (err)  mainWindow.webContents.send("auth:modifier", err);
                  mainWindow.webContents.send("auth:modifier", {users : rows , user : value});
                }
              );
        
            
            }
          );
        }
      })
      ipcMain.on("closeWindow",  (event,value)=>{
      app.quit()
     })
     ipcMain.on("minimizeWindow",  (event,value)=>{
        mainWindow.minimize()
     })
     ipcMain.on("changeScreen",  (event,value)=>{
        if(value.isFullScreen){
            mainWindow.unmaximize()
        }else{
            mainWindow.maximize()
            
           
        }
     })
}

function ReturnAllUser(){
  return  new Promise(( resolve , reject )=>{
    db.all(
      `SELECT * FROM user`,
      function(err, rows) {
        if (err) reject(err);
       resolve(rows)
      }
    );
  })
}
module.exports = User;

