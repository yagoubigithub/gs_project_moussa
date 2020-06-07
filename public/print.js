const {   ipcMain } =  require("electron");

const isDev = require("electron-is-dev");
const { BrowserWindow } = require("electron");
const mainWindow = require('./mainWindow');

const methode = Print.prototype;

function Print(){
 //Print

 
 

  
  ipcMain.on("print:devis", (event, value) => {
    const printWindow = new BrowserWindow({
        
        webPreferences: {
          nodeIntegration: true,
          nativeWindowOpen: true
        },
        width : 1200,
        height : 900,
        transparent : true
        
       
      });
      printWindow.loadURL(
        isDev
          ? "http://localhost:3000/print.html"
          : `file://${path.join(__dirname, "../build/print.html")}`
      );
   //  printWindow.hide()
      printWindow.webContents.on('dom-ready', ()=>{
        printWindow.webContents.send("print:devis", value);
        ipcMain.once('print:close', (event,value)=>{
            printWindow.close();
            mainWindow.webContents.send('print:devis' , {save : true})
        })
      })
      
  
  });

  
   
}
module.exports = Print;

