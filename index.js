const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
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
})


ipcMain.on('write-Note', (event, args) => {
  console.log(args);
  let data = {
    title : args.notetitle,
    content : args.body
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
      event.sender.send('write-Note-Reply', {success: false});
    } 
    else{
      fs.readFile('files/track.json','utf-8',(err, data) => {
        if(err){
          console.log(err);
          event.sender.send('write-Note-Reply', {success: false});
        }
        else{
          let parsedData = JSON.parse(data);
          parsedData.unshift(log);
          let stringToPush = JSON.stringify(parsedData);
          fs.writeFile('files/track.json', stringToPush, (err)=>{
            if(err){
              console.log(err);
            }
            else{
              console.log('written correctly');
              event.sender.send('write-Note-Reply', {success : true});
            }
          });
        }
      });
    }
    
  });
  
})
