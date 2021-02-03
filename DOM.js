let ipc = require('electron').ipcRenderer;
let paint = require('./custom-modules/paint');
let io = require('./custom-modules/io-frontend');

function cl(log) { return console.log(log); }

function $(elem) {
    return document.querySelector(elem);
}

(function () {

    paint.init_paint();
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
    // $('#snSearch').addEventListener('keypress', () => {
    //   io.Search();
    // })
    //end search event
})();
