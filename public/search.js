const isDev = require("electron-is-dev");
const path =  require('path')

const { BrowserWindow, app, ipcMain  } = require("electron");
const mainWindow = require("./mainWindow");



let mainWindow_Bounds = BrowserWindow.getAllWindows()[0].getBounds()


let searchWindow = new BrowserWindow({
    show :false,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
     
    },
    width : 400,
    height : 500,
  //  transparent : true,
  //  alwaysOnTop : true,
  //  skipTaskbar: true,
 //frame : false,
    x : mainWindow_Bounds.x + 50,
     y : mainWindow_Bounds.y + 50,
    icon: `${path.join(__dirname, "./logo512.png")}`
  });
  searchWindow.loadURL(
    isDev
      ? "http://localhost:3000/search.html"
      : `file://${path.join(__dirname, "../build/search.html")}`
  );
  
  
 
  mainWindow.on('minimize',()=>{
    searchWindow.hide()
  })
  mainWindow.on('resize',()=>{
    searchWindow.hide()
  })
  mainWindow.on('maximize',()=>{
    searchWindow.hide()
  });
  mainWindow.on('unmaximize',()=>{
    searchWindow.hide()
  });
  
  mainWindow.on('move',()=>{
    searchWindow.hide()
  })
 
module.exports = searchWindow;

