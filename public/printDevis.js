const {   ipcMain } =  require("electron");

const isDev = require("electron-is-dev");
const { BrowserWindow } = require("electron");
const mainWindow = require('./mainWindow');

const methode = PrintDevis.prototype;

function PrintDevis(){
 //PrintDevis

 
 

  
  ipcMain.on("printToPdf:devis", (event, value) => {
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
          ? "http://localhost:3000/printDevis.html"
          : `file://${path.join(__dirname, "../build/printDevis.html")}`
      );
   //  printWindow.hide()
      printWindow.webContents.on('dom-ready', ()=>{
        printWindow.webContents.send("printToPdf:devis", value);
        ipcMain.once('printToPdf:close', (event,value)=>{
            printWindow.close();
            mainWindow.webContents.send('printToPdf:devis' , {save : true})
        })
      })
      
  
  });

  
  ipcMain.on("print:devis", (event , value)=>{
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
        ? "http://localhost:3000/printDevis.html"
        : `file://${path.join(__dirname, "../build/printDevis.html")}`
    );
 //  printWindow.hide()
    printWindow.webContents.on('dom-ready', ()=>{
      printWindow.webContents.send("print:devis", value);
      ipcMain.once('print:close', (event,value)=>{
          printWindow.close();
          mainWindow.webContents.send('print:devis' , {save : true})
      })
    })
  })
   
   
}
module.exports = PrintDevis;

