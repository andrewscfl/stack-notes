# stack-notes
electron based app for CS students taking notes


overview:

built on electron for easier design and compatibility.

index.js is the "backend" of the application (interfaces with the operating system and io operations via node)

DOM.js, index.html, main.css is the frontend js of the application and works like a regular browser window with the exeption of ipc calls.
to communicate with index.js you can either send a sync or async call to the index.js using the term string set and the data you want to transmit

example: 
```
//IN DOM.JS

(sync call)

let response = ipc.sendSync('save-contents', {
            contents: clonedDom.innerHTML,
            filename: document.querySelector('.SN-note-tag').innerHTML
        });
        if (response.success) {
           //code here
        }
        
//IN MAIN.JS

(sync response)

ipcMain.on('save-contents', (event, args) => {
  let toSave = args.contents;
  let filename = args.filename;
  event.returnValue = { success: true };
});

```


STILL NEEDED:

- animations for popup modal and other application functions
- side over/minimize of notes sidebar
- confirmation for deleting
- autosave
- ongoing testing for code inserting to be free of bugs
- loading splash screen
- test formatting (creating headers and coloring text)
- notes exporting, already saved in fs as .json file, need to be able to load and export
