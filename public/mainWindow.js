const isDev = require("electron-is-dev");
const path =  require('path')

const { BrowserWindow, app } = require("electron");




let mainWindow = new BrowserWindow({
    show :false,
  // frame : false,
    webPreferences: {
      nodeIntegration : true,
      nativeWindowOpen : true,
     
    },
    icon: `${path.join(__dirname, "./logo512.png")}`
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  
  if(!isDev){
    mainWindow.removeMenu()
  }
  
 
 
mainWindow.on('close', (e)=>{
  app.quit()
})

module.exports = mainWindow;

