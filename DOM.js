let ipc = require('electron').ipcRenderer;

function cl(log) { return console.log(log);}

function $(elem) {
    return document.querySelector(elem);
}

  // Clear main pane
function clear_main_pain() {
    $('.SN-main-content-note-title').innerHTML = "";
    $('.SN-main-content-note-title').style.display = "none";
    $('.SN-Notes').innerHTML = "";
}

  // Create Sidebar
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

  // Main Container and editor
function paint_main(data, filename) {
    let note_title = data.title;
    let note_body = data.content;
    let noteDOM = document.createElement('div');
    noteDOM.innerHTML = note_body;




    document.querySelector('.SN-note-tag').innerHTML = filename;
    document.querySelector('.SN-main-content-note-title').style.display = "flex";
    document.querySelector('.SN-main-content-note-title').innerHTML = note_title;
    document.querySelector('.SN-Notes').innerHTML = noteDOM.innerHTML;

    let activeEditors = noteDOM.querySelectorAll('.editor');
    activeEditors.forEach((ed) => {
        let edID = ed.id;
        cl(edID);
        let frame = ace.edit(edID);
        frame.setTheme("ace/theme/idle_fingers");
        cl('PRINTING NEXT');
        let sel = ed.nextElementSibling;

        let targetLang = sel.querySelector('#languages').dataset.lang;
        sel.querySelector('#languages').value = targetLang;
        cl(targetLang);
        console.log("targettLang", targetLang)

        //init languages

        switch(targetLang) {
          case 'C':
              frame.session.setMode("ace/mode/c_cpp");
            break;
          case 'C#':
              frame.session.setMode("ace/mode/csharp");
            break;
          case 'C++':
              frame.session.setMode("ace/mode/c_cpp");
            break;
          case 'Java':
              frame.session.setMode("ace/mode/java");
            break;
          case 'Python':
            frame.session.setMode("ace/mode/python");
          default:
            frame.session.setMode("ace/mode/javascript");
        }

        // if (targetLang == "C") {
        //     frame.session.setMode("ace/mode/c_cpp");
        // }
        // else if (targetLang == "C#") {
        //     frame.session.setMode("ace/mode/csharp");
        // }
        // else if (targetLang == "C++") {
        //     frame.session.setMode("ace/mode/c_cpp");
        // }
        // else if (targetLang == "Java") {
        //     frame.session.setMode("ace/mode/java");
        // }
        // else if (targetLang == "JavaScript") {
        //     frame.session.setMode("ace/mode/javascript");
        // }
        // else if (targetLang == "Python") {
        //     frame.session.setMode("ace/mode/python");
        // }

        //end languages

    });
}

  // New item
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

  // New note popup UI
function build_popup(inner) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="popup-container">
          <div class="popup-close"><i class="fas fa-times"></i></div>
          ${inner}
        </div>
      `;

    document.body.appendChild(wrapper);
      $('.popup-close').addEventListener('click', () => {
        $('.popup-container').remove(); // fadeOut() isn't a function?
      });
}

  // Write note
function write_File(data) {
    let response = ipc.sendSync('write-Note', data);
    return response;
}

  // Delete note
function confirm(callback) {
    let contents = `
        <h2>Delete Note?</h2>
        <a class="btn" id="DelConf">Delete Note</a>
        <a class="btn" id="CancelConf">Cancel Note</a>
        `;

    build_popup(contents);


    $('#DelConf').addEventListener('click', () => {
        callback();
    });

    $('#CancelConf').addEventListener('click', () => {
        $('.popup-container').remove();
    });


}


(function () {
    // test sending data to other process

    init_paint();

// New note UI
    $('.SN-main-sidebar-controls-plus').addEventListener('click', () => {
        let contents = `
        <h2>new note</h2>
        <div class="popup-input">
          <input type="text" id="note-title" placeholder="note title">
        </div>
        <a class="new_note" id="noteCreation">Create Note</a>
        `;

        build_popup(contents);
      // new note function
        $("#noteCreation").addEventListener('click', () => {
            let title = $('#note-title').value,
                content = '//write code or notes here! :)',
                date = new Date(),
                now = date.getTime(),
                stringNow = now.toString(),
                uniqueID = title.replace(new RegExp(' ', 'g'), "-") + "-" + stringNow;


            let saveData = {
                  uid: uniqueID,
                  notetitle: title,
                  body: content
              };

            //call to main process to write file
            let response_write = write_File(saveData);
            paint_sidebar(saveData);
            //end call to main process
            $('.popup-container').remove();
        });
    });


// Save
    $('.save').addEventListener('click', (event) => {
        let editableDom = $('.SN-Notes');
        let editors = editableDom.querySelectorAll('.editor');
        let editorData = [];

        editors.forEach(editor => {
            let value = editor.id;
            let text = ace.edit(value).getValue();
            let editorPackage = {
                id: value,
                inner: text
            };
            editorData.push(editorPackage);
        });

        let content = $('.SN-Notes').innerHTML;
        let targetContent = $('.SN-Notes');
        let clonedDom = targetContent.cloneNode(true);
        let codeEditors = clonedDom.querySelectorAll('.editor');

        for (let i = 0; i < codeEditors.length; i++) {
            let elem = document.createElement('div');
            elem.id = editorData[i].id;
            elem.className = "editor";
            elem.innerHTML = editorData[i].inner;
            codeEditors[i].replaceWith(elem);
        }
        cl('printing virtual editor');
        cl(clonedDom.innerHTML);



        cl(content);
        let response = ipc.sendSync('save-contents', {
            contents: clonedDom.innerHTML,
            filename: document.querySelector('.SN-note-tag').innerHTML
        });
        if (response.success) {
            cl('worked');
            init_paint();
        }
        else {
            cl('not');
        }
    });
// Delete
    $('.delete').addEventListener('click', (event) => {
        let targetNote = $('.SN-note-tag').innerHTML;
        confirm(() => {
            let response = ipc.sendSync('del-note', targetNote);
            if (response.success) {
                console.log('deleted');
                clear_main_pain();
                init_paint();
            }
            else {
                console.log('error');
            }
        });
    });
// Code
    $('.code').addEventListener('click', (event) => {


        let editor = document.createElement('div'),
            notePreTagStripped = $('.SN-note-tag').innerHTML,
            noteTagStripped = notePreTagStripped.replace('.json', '',
            date = new Date(),
            now = date.getTime(),
            stringNow = now.toString(),
            calc_id = noteTagStripped + `-${stringNow}`

        editor.id = calc_id;
        editor.className = "editor";
        editor.style.width = "100%";
        editor.style.height = "300px";
        let myBreak = document.createElement('br'),
            languageSelectorinner = `
        <select name="languages" id="languages" data-lang="PT">
          <option value="PT">Plain Text</option>
          <option value="C">C</option>
          <option value="C#">C#</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
        </select>
        `;
        let languageSelector = document.createElement('div');
        languageSelector.innerHTML = languageSelectorinner;

        $('.SN-Notes').appendChild(myBreak);
        $('.SN-Notes').appendChild(editor);
        $('.SN-Notes').appendChild(languageSelector);
        $('.SN-Notes').appendChild(myBreak);
        let editorFrame = ace.edit(calc_id);
        editorFrame.setTheme("ace/theme/idle_fingers");


        //add event listeners for changes


        let selectors = languageSelector.querySelector('#languages');
        selectors.addEventListener('change', (event) => {
            let selected = event.target.value;
            selectors.dataset.lang = selected;
            cl(selected + " was applied on " + editor.id);
            if (selected == "C") {
                editorFrame.session.setMode("ace/mode/c_cpp");
            }
            else if (selected == "C#") {
                editorFrame.session.setMode("ace/mode/csharp");
            }
            else if (selected == "C++") {
                editorFrame.session.setMode("ace/mode/c_cpp");
            }
            else if (selected == "Java") {
                editorFrame.session.setMode("ace/mode/java");
            }
            else if (selected == "JavaScript") {
                editorFrame.session.setMode("ace/mode/javascript");
            }
            else if (selected == "Python") {
                editorFrame.session.setMode("ace/mode/python");
            }

        });

        //end event listeners for changes
    });

})();
