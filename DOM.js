let ipc = require('electron').ipcRenderer;
let compile = require('./custom-modules/compile');
let paint = require('./custom-modules/paint');
let io = require('./custom-modules/io-frontend');
let updates = require('./custom-modules/rest');


function cl(log) { return console.log(log); }

function $(elem) {
    return document.querySelector(elem);
}

(function () {

    paint.init_paint();
    updates.updates_get();
  // New note UI
    $('.SN-main-sidebar-controls-plus').addEventListener('click', () => {
        io.Create();
    });
  // Save
    $('.save').addEventListener('click', (event) => {
      io.Save();
    });
  // Delete
    $('.delete').addEventListener('click', (event) => {
       io.Delete();
    });
  // Code
    $('.code').addEventListener('click', (event) => {
        paint.paint_new_code_block();
        //end event listeners for changes
    });
  //search event
    $('.search-button').addEventListener('click', () => {
      io.Search();
    });
  //Autosave
    io.Autosave();
  //Minimize/Maximize
    $('#minimize').addEventListener('click', () => {
      io.MiniMaxi();
    })
})();
