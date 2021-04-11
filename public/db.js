
const path = require('path')
const {app} = require("electron")
const dbPath = path.join(app.getPath('userData').toString(), 'data.sqlite')

const sqlite = require("sqlite3").verbose();
const { dialog } = require('electron')
const fs = require('fs');
console.log(dbPath);
if (fs.existsSync(dbPath)) {
  const options = {
    type: 'question',
    buttons: ['Cancel', 'Yes, please', 'No, thanks'],
    defaultId: 2,
    title: 'Question',
    message:   "the file exists",
    detail: 'It does not really matter',
    checkboxLabel: 'Remember my answer',
    checkboxChecked: true,
  };

  dialog.showMessageBox(null, options, (response, checkboxChecked) => {
    console.log(response);
    console.log(checkboxChecked);
  });
  console.log('the file exists');
} else { 
  const options = {
  type: 'question',
  buttons: ['Cancel', 'Yes, please', 'No, thanks'],
  defaultId: 2,
  title: 'Question',
  message:   "the file does not  exists ",
  detail: 'It does not really matter',
  checkboxLabel: 'Remember my answer',
  checkboxChecked: true,
};

dialog.showMessageBox(null, options, (response, checkboxChecked) => {
  console.log(response);
  console.log(checkboxChecked);
});

  console.log('the file does not not');
}
  db = new sqlite.Database(dbPath, error => {
    if(error){


    const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: 'Question',
      message: error + "" + app.getPath('userData').toString(),
      detail: 'It does not really matter',
      checkboxLabel: 'Remember my answer',
      checkboxChecked: true,
    };
  
    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      console.log(response);
      console.log(checkboxChecked);
    });
    }else{
      const options = {
        type: 'question',
        buttons: ['Cancel', 'Yes, please', 'No, thanks'],
        defaultId: 2,
        title: 'Question',
        message: 'Do you want to do this?',
        detail: 'It does not really matter',
        checkboxLabel: 'Remember my answer',
        checkboxChecked: true,
      };
    
      dialog.showMessageBox(null, options, (response, checkboxChecked) => {
        console.log(response);
        console.log(checkboxChecked);
      });
    }



  });

  db.serialize(function() {

  });
module.exports = db;