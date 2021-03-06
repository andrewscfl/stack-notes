const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 870,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

ipcMain.on('init', (event, args) => {
  fs.readFile('files/track.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      event.returnValue = { success: false };
    }
    else {
      let parsedJson = JSON.parse(data);
      event.returnValue = parsedJson;
    }
  });
});


ipcMain.on('write-Note', (event, args) => {
  console.log(args);
  let data = {
    title: args.notetitle,
    content: args.body
  };

  let dataReadyToWrite = JSON.stringify(data);
  let filepath = args.uid.split(" ").join("-");
  let date = new Date();
  let now = date.getTime();

  let log = {
    fp: `${filepath}.json`,
    updated: now
  };

  fs.writeFile(`files/${filepath}.json`, dataReadyToWrite, (err) => {
    if (err) {
      console.log(err);
      event.returnValue = { success: false };
    }
    else {
      fs.readFile('files/track.json', 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          event.returnValue = { success: false };
        }
        else {
          let parsedData = JSON.parse(data);
          parsedData.unshift(log);
          let stringToPush = JSON.stringify(parsedData);
          fs.writeFile('files/track.json', stringToPush, (err) => {
            if (err) {
              console.log(err);
              event.returnValue = { success: false };
            }
            else {
              console.log('written correctly');
              event.returnValue = { success: true };
            }
          });
        }
      });
    }

  });

});

ipcMain.on('get-contents', (event, args) => {
  let filename = args;
  fs.readFile(`files/${filename}`, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      event.returnValue = { success: false };
    }
    else {
      let parsedData = JSON.parse(data);
      event.returnValue = parsedData;
    }
  });
});



ipcMain.on('save-contents', (event, args) => {
  let toSave = args.contents;
  let filename = args.filename;
  fs.readFile(`files/${filename}`, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      event.returnValue = { success: false };

    }
    else {
      let parsedJSON = JSON.parse(data);
      parsedJSON.content = toSave;
      let stringReadyToSave = JSON.stringify(parsedJSON);
      fs.writeFile(`files/${filename}`, stringReadyToSave, (err) => {
        if (err) {
          console.log(err);
          event.returnValue = { success: false };

        }
        else {
          event.returnValue = { success: true };
        }
      });
    }

  });
});


ipcMain.on('del-note', (event, args) => {
  let fileToDel = args;
  let path = `files/${fileToDel}`;
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
      event.returnValue = { success: false };
    }
    else {
      fs.readFile('files/track.json', 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          event.returnValue = { success: false };
        }
        else {
          let parsed = JSON.parse(data);
          for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].fp == fileToDel) {
              parsed.splice(i, 1);
            }
          }
          let stringParsed = JSON.stringify(parsed);
          fs.writeFile('files/track.json', stringParsed, (err) => {
            if (err) {
              console.log(err);
              event.returnValue = { success: false };
            }
            else {
              event.returnValue = { success: true };
            }
          });
        }
      });
    }
  });

});



ipcMain.on('search', (event, args) => {
  let term = args

  console.log(`search term here ${args}`);

  fs.readFile('files/track.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      let parsedJSON = JSON.parse(data);

      for (let x = 0; x < parsedJSON.length; x++) {
        let file = parsedJSON[x];
        let filename = file.fp;

        fs.readFile(`files/${filename}`, 'utf-8', (err, data) => {
          if (err) console.log(err);
          else {
            let each_parsed = JSON.parse(data);
            console.log('parsed below');
            console.log(each_parsed);
            if (each_parsed.content.includes(args)) {
              console.log("TRUE EVAL");
              event.reply('search-results', filename);
            }
          }
        });

      }
    }
  });





});


ipcMain.on('update-version', (event, args) => {
    let versionNo = args;
    fs.readFile('./files/status.json', 'utf-8', (err, readdata) => {
      if(err){
        event.returnValue = {
          success: false,
          newVersion: false
        };
      }
      let data = JSON.parse(readdata);
      let version = data.last_update;
      if (version != versionNo){
        fs.writeFile('./files/status.json', `{"last_update" : ${versionNo}}`, (err)=>{
          if(err){
            event.returnValue = {success: false};
          }
          else{
            event.returnValue = {
              success: true,
              newVersion: true
            }
          }
        }); 
      }
      else{
        event.returnValue = {
          success: true,
          newVersion: false
        };
      }

    });
});
