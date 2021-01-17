let ipc = require('electron').ipcRenderer;

function cl(log) {
    return console.log(log);
}

function $(elem) {
    return document.querySelector(elem);
}


function clear_main_pain(){
    $('.SN-main-content-note-title').innerHTML = "";
    $('.SN-main-content-note-title').style.display = "none";
    $('.SN-Notes').innerHTML = "";
}


function init_paint() {
    document.querySelector('.SN-main-sidebar-content').innerHTML = "";
    let data = ipc.sendSync('init');
    data.forEach((doc) => {
        let doc_id = doc.fp.replace('.json', '');
        let document_data = ipc.sendSync('get-contents', doc.fp);
        let construct = {
            uid: doc_id,
            notetitle: document_data.title,
            body: document_data.content
        };
        paint_sidebar(construct);

    });
}

function paint_main(data, filename) {
    let note_title = data.title;
    let note_body = data.content;
    document.querySelector('.SN-note-tag').innerHTML = filename;
    document.querySelector('.SN-main-content-note-title').style.display = "flex";
    document.querySelector('.SN-main-content-note-title').innerHTML = note_title;
    document.querySelector('.SN-Notes').innerHTML = note_body;

}

function paint_sidebar(data) {
    let mUID = data.uid;
    let title = data.notetitle;
    let strippedContent = data.body.substring(0, 25) + "...";
    let inner = `
    <div class="SN-main-sidebar-elem ${mUID}">
                <div class="SN-main-sidebar-elem-title">${title}</div>
                <div class="SN-main-sidebar-elem-content-preview">${strippedContent}</div>
            </div>
    `;
    let builDom = document.createElement('div');
    builDom.innerHTML = inner;
    let targetFile = builDom.querySelector('.SN-main-sidebar-elem').classList[1].concat('.json');
    builDom.querySelector('.SN-main-sidebar-elem').addEventListener('click', (e) => {
        let response_get_file = ipc.sendSync('get-contents', targetFile);
        cl("passing this to paint_main" + JSON.stringify(response_get_file));
        paint_main(response_get_file, targetFile);

    });


    document.querySelector('.SN-main-sidebar-content').appendChild(builDom);
}


function write_File(data) {
    let response = ipc.sendSync('write-Note', data);
    return response;
}






(function () {
    // test sending data to other process

    init_paint();

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



    $('.save').addEventListener('click',(event) => {
        let content = $('.SN-Notes').innerHTML;
        cl(content);
        let response = ipc.sendSync('save-contents', {
            contents : content,
            filename : document.querySelector('.SN-note-tag').innerHTML
        });
        if (response.success){
            cl('worked');
            init_paint();
        }
        else{
            cl('not');
        }
    });


    $('.delete').addEventListener('click', (event) => {
        let targetNote = $('.SN-note-tag').innerHTML;
        let response = ipc.sendSync('del-note', targetNote);
        if (response.success){
            console.log('deleted');
            clear_main_pain();
            init_paint();
        }
        else{
            console.log('error');
        }
    });



    $('.code').addEventListener('click', (event) => {
        let num_of_codeBlocks = (function(){
            let value = $('.SN-note-num-code-blocks').innerHTML;
            if (value == ""){
                return 0;
            }
            else{
                return parseInt($('.SN-note-num-code-blocks').innerHTML);
            }
        })();
        

        let editor = document.createElement('div');
        let notePreTagStripped = $('.SN-note-tag').innerHTML;
        let noteTagStripped = notePreTagStripped.replace('.json', '');
        let calc_id = noteTagStripped + `-${num_of_codeBlocks}`;
        editor.id = calc_id;
        editor.style.width = "100%";
        editor.style.height = "300px";
        let myBreak = document.createElement('br');
        $('.SN-Notes').appendChild(myBreak);
        $('.SN-Notes').appendChild(editor);
        $('.SN-Notes').appendChild(myBreak);
        let editorFrame = ace.edit(calc_id);
        editorFrame.setTheme("ace/theme/twilight");


    });














})();