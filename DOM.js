let ipc = require('electron').ipcRenderer;


(function () {

    // test sending data to other process







    function $(elem) {
        return document.querySelector(elem);
    }

    function buildEntry(title, content, uniqueID) {
        let strippedContent = content.substring(0, 25) + "...";
        let mUID = uniqueID.split(" ").join("-");
        let inner = `
        <div class="SN-main-sidebar-elem ${mUID}">
                    <div class="SN-main-sidebar-elem-title">${title}</div>
                    <div class="SN-main-sidebar-elem-content-preview">${strippedContent}</div>
                </div>
        `;

        return inner;
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
            let uniqueID = title.concat(stringNow);
            let element = buildEntry(title, content, uniqueID);
            let elemWrapper = document.createElement('div');
            elemWrapper.innerHTML = element;

            let saveData = {
                uid: uniqueID,
                notetitle: title,
                body: content
            };

            //call to main process to write file
            ipc.send('write-Note', saveData);
            ipc.on('write-Note-Reply', (event, args) => {
                console.log(args);
            });
            //end call to main process
            $(".SN-main-sidebar-content").appendChild(elemWrapper);
            elemWrapper.addEventListener('click',(e)=> {
                let target = e.currentTarget;
                let targetClassList = target.querySelector('.SN-main-sidebar-elem').classList;
                console.log(targetClassList);
            });

        });
    });














})();