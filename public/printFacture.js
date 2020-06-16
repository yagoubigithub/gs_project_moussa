const {   ipcMain } =  require("electron");

const isDev = require("electron-is-dev");
const { BrowserWindow } = require("electron");
const mainWindow = require('./mainWindow');

const methode = PrintFacture.prototype;

function PrintFacture(){
 //PrintFacture

 
 

  
  ipcMain.on("printToPdf:facture", (event, value) => {
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
          ? "http://localhost:3000/printFacture.html"
          : `file://${path.join(__dirname, "../build/printFacture.html")}`
      );
   //  printWindow.hide()
      printWindow.webContents.on('dom-ready', ()=>{
        printWindow.webContents.send("printToPdf:facture", value);
        ipcMain.once('printToPdf:close', (event,value)=>{
            printWindow.close();
            mainWindow.webContents.send('printToPdf:facture' , {save : true})
        })
      })
      
  
  });

  
  ipcMain.on("print:facture", (event , value)=>{
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
        ? "http://localhost:3000/printFacture.html"
        : `file://${path.join(__dirname, "../build/printFacture.html")}`
    );
 //  printWindow.hide()
    printWindow.webContents.on('dom-ready', ()=>{
      printWindow.webContents.send("print:facture", value);
      ipcMain.once('print:close', (event,value)=>{
          printWindow.close();
          mainWindow.webContents.send('print:facture' , {save : true})
      })
    })
  })
   
}
module.exports = PrintFacture;

