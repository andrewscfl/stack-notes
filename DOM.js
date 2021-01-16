let ipc = require('electron').ipcRenderer;


(function () {
    // test sending data to other process
    function cl(log){
        return console.log(log);
    }

    function $(elem) {
        return document.querySelector(elem);
    }

    function paint_main(data){
        let note_title = data.title;
        let note_body = data.content;
        document.querySelector('.SN-main-content-note-title').innerHTML = note_title;
        document.querySelector('.SN-Notes').innerHTML = note_body;

    }

    function paint_sidebar(data) {
        let mUID = data.uid;
        let title = data.notetitle;
        let strippedContent = data.body.substring(0,25);
        let inner = `
        <div class="SN-main-sidebar-elem ${mUID}">
                    <div class="SN-main-sidebar-elem-title">${title}</div>
                    <div class="SN-main-sidebar-elem-content-preview">${strippedContent}</div>
                </div>
        `;
        let builDom = document.createElement('div');
        builDom.innerHTML = inner;
        let targetFile = builDom.querySelector('.SN-main-sidebar-elem').classList[1].concat('.json');
        builDom.querySelector('.SN-main-sidebar-elem').addEventListener('click', (e)=>{
            let response_get_file = ipc.sendSync('get-contents', targetFile);
            paint_main(response_get_file);
            
        });
        

        document.querySelector('.SN-main-sidebar-content').appendChild(builDom);
    }


    function write_File(data){
        let response = ipc.sendSync('write-Note',data);
        return response;
    }
    
    function read_file(){

    }



    $('.SN-main-sidebar-controls-plus').addEventListener('click', () => {
        let popup = document.createElement('div');
        popup.innerHTML = `
        <div class="popup-container">
        <div class="popup-close">X</div>
        <h2>NOTE TITLE</h2>
        <div class="popup-input">
        <input type="text" id="note-title">
        </div>
        <a class="btn" id="noteCreation">Create Note</a>
        </div>
        `;
        document.body.appendChild(popup);
        $('.popup-close').addEventListener('click', () => {
            $('.popup-container').remove();
        });

        $("#noteCreation").addEventListener('click', () => {
            let title = $('#note-title').value;
            let content = '//write code or notes here! :)';
            let date = new Date();
            let now = date.getTime();
            let stringNow = now.toString();
            let uniqueID = title.replace(new RegExp(' ', 'g'), "-") + "-" + stringNow;
            

            let saveData = {
                uid: uniqueID,
                notetitle: title,
                body: content
            };

            //call to main process to write file
            let response_write = write_File(saveData);
            paint_sidebar(saveData);
            //end call to main process

        });
    });














})();