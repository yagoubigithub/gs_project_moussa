const {   ipcMain } =  require("electron");

const isDev = require("electron-is-dev");
const { BrowserWindow } = require("electron");

const methode = Print.prototype;

function Print(){
 //Print

 
 

  
  ipcMain.on("print:devis", (event, value) => {
    const printWindow = new BrowserWindow({
        
        webPreferences: {
          nodeIntegration: true,
          nativeWindowOpen: true
        },
        width: 400,
        height: 400,
        show: false
      });
      printWindow.loadURL(
        isDev
          ? "http://localhost:3000/print.html"
          : `file://${path.join(__dirname, "../build/print.html")}`
      );
     
      printWindow.webContents.on('dom-ready', ()=>{
        printWindow.webContents.send("print:devis", value);
        ipcMain.once('print:close', (event,value)=>{
            printWindow.close();
        })
      })
      
    console.log(value)
  });

  
   
}
module.exports = Print;

