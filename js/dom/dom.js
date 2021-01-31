let ipc = require('electron').ipcRenderer;

const cl = (log) => { return console.log(log);}

const $ = (elem) => { return document.querySelector(elem); }


// Clear Main pane
const clear_main_pain = () {
    $('.SN-main-content-note-title').innerHTML = "";
    $('.SN-main-content-note-title').style.display = "none";
    $('.SN-Notes').innerHTML = "";
}
