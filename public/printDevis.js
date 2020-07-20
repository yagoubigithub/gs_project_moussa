const { ipcMain } = require("electron");

const isDev = require("electron-is-dev");
const { BrowserWindow, dialog } = require("electron");
const mainWindow = require("./mainWindow");
var pdf = require("html-pdf");
const methode = PrintDevis.prototype;
const path = require("path");

function PrintDevis() {
  //PrintDevis

  ipcMain.on("printToPdf:devis", (event, value) => {
    let html = `
    <!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
   

    
    <style>

    *{
      box-sizing :border-box;
    }
    
    .print-page-container{
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
    width: 210mm;
    min-height: 297mm;
    background-color: white;
    box-sizing: border-box;
    padding : 10mm;
      
    }
    .print-page-head{
    height : 80mm;
    min-height : 80mm;
    
    }
    .print-page-footer{
      height : 10mm;
      min-height : 10mm;
      
     
    }
    .print-page-content {
      
      height : 180mm;
      min-height : 180mm;
    
    
    }
    
    .page-row{
      
      width : 100%;
      justify-content: space-between;
    }
    .page-col{
     float : left;
     width : 50%;
     
    }
    .print-page-container table{
      width : 100%;
      border : 1px double black;
    }
    .print-page-container p {
      font-size: 14px;
      font-weight: 400;
    }
    .bureau-info{
    margin-top: 25px;
    }
    hr{
      width : 100%;
    }
    .logo-entreprise-page{
      max-width:  100px;
      
     float: right;
    }
    .entreprise-fiscaux{
     
      margin-top: 25px;
      
    }
    .entreprise-fiscaux p {
      font-weight: 700 !important;
      margin : 10px !important;
      
    }
    .entreprise-info {
      text-align: right;
    }
    
    .print-page-container table td,th{
      border-bottom: 1px solid rgba(0, 0, 0, 1);
      text-align: left;
      padding : 3px;
      max-height: 60px;
      max-width: 350px;
      text-align: center;
    }
    .print-page-container p,h1,h2,h3,h4,h5,h6{
      margin: 5px;
      color: black;
      font-family: Arial, Helvetica, sans-serif;
    }
    .pt-1{
      padding-top : 10px;
    }
    
  
    </style>
    </head>
    <body>`;
    value.pages.forEach((page, index) => {
      html = html + `<div id="page-${index}">${page.page}</div>`;
    });
    html =
      html +
      `</body>
    </html>`;

    let directory = "../../";
    dialog
      .showOpenDialog(mainWindow, {
        properties: [
          "openFile",
          "openDirectory",
          "promptToCreate",
          "showHiddenFiles",
        ],
      })
      .then((result) => {
        if (!result.canceled) {
        

          directory = result.filePaths.toString();
          const option = {
            directory: directory,

       "phantomPath": isDev ? "./node_modules/phantomjs/lib/phantom/bin/phantomjs" :  __dirname + "/../../../phantomjs",
            format: "A4",
            height: "300mm", // allowed units: mm, cm, in, px
            width: "210mm",
            header: {
              height: "0mm",
            },
            footer: {
              height: "0mm",
            },
            script: isDev ? path.join(__dirname,"../node_modules/html-pdf/lib/scripts", 'pdf_a4_portrait.js').toString() :
            path.join( __dirname ,"../", "../", "../", 'pdf_a4_portrait.js').toString()
          };

          const Alert = require("electron-alert");
          let alert = new Alert();

          let swalOptions = {
            title: path.join(directory, "devis.pdf").toString(),
            text: path.join(directory, "devis.pdf").toString(),
            type: "warning",
            showCancelButton: true,
          };

          alert.fireFrameless(swalOptions, null, true, false);

          pdf
            .create(html, option)
            .toFile(path.join(directory, "devis.pdf").toString(), function (
              err,
              res
            ) {
             
              let swalOptions = {
                title: err ? err.message : res.filename,
                text: err ? err.message : res.filename,
                type: "warning",
                showCancelButton: true,
              };
              alert.fireFrameless(swalOptions, null, true, false);
            });
        }
      });

    /*
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
      
  */
  });

  ipcMain.on("print:devis", (event, value) => {
    const printWindow = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        nativeWindowOpen: true,
      },
      width: 1200,
      height: 900,
      transparent: true,
    });
    printWindow.loadURL(
      isDev
        ? "http://localhost:3000/printDevis.html"
        : `file://${path.join(__dirname, "../build/printDevis.html")}`
    );
    //  printWindow.hide()
    printWindow.webContents.on("dom-ready", () => {
      printWindow.webContents.send("print:devis", value);
      ipcMain.once("print:close", (event, value) => {
        printWindow.close();
        mainWindow.webContents.send("print:devis", { save: true });
      });
    });
  });
}
module.exports = PrintDevis;
