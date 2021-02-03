// this module is for "paiting" things to the DOM


const write_log = () => {
    console.log('worked buddy');
}

const clear_main_pain = () => {
    $('.SN-main-content-note-title').innerHTML = "";
    $('.SN-main-content-note-title').style.display = "none";
    $('.SN-Notes').innerHTML = "";
}

const init_paint = () => {
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

const paint_main_from_load = (data, filename) => {
    let note_title = data.title;
    let note_body = data.content;
    let noteDOM = document.createElement('div');
    noteDOM.innerHTML = note_body;
    document.querySelector('.SN-note-tag').innerHTML = filename;
    document.querySelector('.SN-main-content-note-title').style.display = "flex";
    document.querySelector('.SN-main-content-note-title').innerHTML = note_title;
    document.querySelector('.SN-Notes').innerHTML = noteDOM.innerHTML;

    let allSelectors = document.querySelectorAll('select');
    allSelectors.forEach((each) => {
        each.style.display = "none";
    });

    let activeEditors = noteDOM.querySelectorAll('.editor');
    activeEditors.forEach((ed) => {
        let edID = ed.id;
        console.log(edID);
        let frame = ace.edit(edID);
        frame.setTheme("ace/theme/idle_fingers");
        console.log('PRINTING NEXT');
        let sel = ed.nextElementSibling;
        let targetLang = sel.querySelector('#languages').dataset.lang;
        //init languages

        switch (targetLang) {
            case 'C':
                frame.session.setMode("ace/mode/c_cpp");
                console.log('reached');
                break;
            case 'C#':
                frame.session.setMode("ace/mode/csharp");
                console.log('reached');
                break;
            case 'C++':
                frame.session.setMode("ace/mode/c_cpp");
                console.log('reached');
                break;
            case 'Java':
                frame.session.setMode("ace/mode/java");
                console.log('reached');
                break;
            case 'Python':
                frame.session.setMode("ace/mode/python");
                console.log('reached');
                break;
            default:
                frame.session.setMode("ace/mode/javascript");
                sel.querySelector('#languages').value = "JavaScript";
        }


    });
}

const paint_sidebar = (data) => {
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
        paint_main_from_load(response_get_file, targetFile);

    });


    document.querySelector('.SN-main-sidebar-content').appendChild(builDom);
}


const paint_popup = (inner) => {
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


const paint_confirm = (callback) => {
    let contents = `
          <h2>Delete Note?</h2>
          <a class="btn btn-delete" id="DelConf">Delete Note</a>
          <a class="btn btn-cancel" id="CancelConf">Cancel</a>
        `;

    paint_popup(contents);

    $('#DelConf').addEventListener('click', () => {
        callback();
        $('.popup-container').remove();
    });

    $('#CancelConf').addEventListener('click', () => {
        $('.popup-container').remove();
    });


}

const paint_new_code_block = () => {
    let editor = document.createElement('div'),
        notePreTagStripped = $('.SN-note-tag').innerHTML,
        noteTagStripped = notePreTagStripped.replace('.json', ''),
        date = new Date(),
        now = date.getTime(),
        stringNow = now.toString(),
        calc_id = `${noteTagStripped}-${stringNow}`

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
}


module.exports = {
    write_log,
    clear_main_pain,
    init_paint,
    paint_main_from_load,
    paint_sidebar,
    paint_popup,
    paint_confirm,
    paint_new_code_block
};
