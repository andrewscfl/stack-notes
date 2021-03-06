let paint = require('./paint'),
  fs = require('fs')



ipc.on('search-results', (events, args) => {
  //FOR EACH FILE THAT CONTAINS A TERM THIS WILL FIRE WITH THE FILENAME AS ARGS

  console.log('result ->', args)
  
  if (args.includes('.json')) {
    // Create object out of each filename:
    let doc_id = args.replace('.json', ''),
      document_data = ipc.sendSync('get-contents', args),
      fileObj = {
        uid: doc_id,
        notetitle: document_data.title,
        body: document_data.content
      };
    // paint to DOM:
    paint.paint_sidebar(fileObj);
  }
  
});


const $ = (elem) => { return document.querySelector(elem); }

const write_File = (data) => {
  let response = ipc.sendSync('write-Note', data);
  return response;
}

const Save = () => {
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
  console.log('printing virtual editor');
  console.log(clonedDom.innerHTML);



  console.log(content);
  let response = ipc.sendSync('save-contents', {
    contents: clonedDom.innerHTML,
    filename: document.querySelector('.SN-note-tag').innerHTML
  });
  if (response.success) {
    console.log('worked');
    paint.init_paint();
  }
  else {
    console.log('not');
  }
}

const Delete = () => {
  let targetNote = $('.SN-note-tag').innerHTML;
  paint.paint_confirm(() => {
    let response = ipc.sendSync('del-note', targetNote);
    if (response.success) {
      console.log('deleted');
      paint.clear_main_pain();
      paint.init_paint();
    }
    else {
      console.log('error');
    }
  });
}

const Create = () => {
  let contents = `
    <h2>new note</h2>
    <div class="popup-input">
      <input type="text" id="note-title" placeholder="note title">
    </div>
    <a class="new_note" id="noteCreation">Create Note</a>
    `;

  paint.paint_popup(contents);
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
    let response_write = io.write_File(saveData);
    paint.paint_sidebar(saveData);
    //end call to main process
    $('.popup-container').remove();
  });
}

const Search = () => {
  let query = $('#snSearch').value,
    resArr = [],
    notes = document.getElementsByClassName('SN-main-sidebar-elem'),
    noteArr = []

  if (query !== '' || !(query.length === 0 || !this.trim())) {

    // Search UX
    $('.search-button').style.display = 'none'
    $('.clear-search').style.display = 'block'

    // First clear out notes from DOM:
    for (let i = 0; i <= notes.length - 1; i++) { noteArr.push(notes[i]) }
    noteArr.forEach((note) => { note.remove() })

    setTimeout(() => {
      if (notes.length < 1) {
        no_res = `
            <div class="no_results">
              <span>No results found.</span>
            </div>
          `
        $('.SN-main-sidebar-content').innerHTML = no_res
      }
    }, 100)

    // Get Results:

    ipc.send('search', query);

    // Clear search
    $('.clear-search').addEventListener('click', () => {
      $('.search-button').style.display = 'block'
      $('.clear-search').style.display = 'none'
      $('#snSearch').value = ''
      paint.init_paint();
    })
  }
}

const DeleteEditor = () => {
  document.querySelectorAll('.delete-editor').forEach((button) => {
    button.addEventListener('click', () => {

      let rdm_id = button.id.split('-^-')[1]
      console.log("Deleting:", rdm_id)
      document.getElementById(`${rdm_id}`).remove
      document.getElementById(`ide-bar-^-${rdm_id}`).remove()
    })
  })
}

const Autosave = () => {
  let timeout_milliseconds = 30000,
    timeout_id;

  const startTimer = () => {
    // window.setTimeout returns an Id that can be used to start and stop a timer
    timeout_id = window.setTimeout(() => {
      console.log('Autosaving...')

      setTimeout(() => {
        document.querySelector('.autosave').style.visibility = 'visible' //console.log('save icon fade in')
        setTimeout(() => {
          document.querySelector('.autosave').style.visibility = 'hidden'
        }, 1000) // console.log('save icon fade out') }, 2000) // Save icon fade outz
      }, 1000) // Save icon fade in

      Save();
    }, timeout_milliseconds)
  },
    resetTimer = () => {
      window.clearTimeout(timeout_id)
      startTimer();
    },
    setupTimers = () => {
      document.addEventListener("mousemove", resetTimer, false)
      document.addEventListener("mousedown", resetTimer, false)
      document.addEventListener("keypress", resetTimer, false)
      document.addEventListener("touchmove", resetTimer, false)

      startTimer()
    }
  setupTimers()
}

const MiniMaxi = () => {
  //animate__animated
  let icon = document.getElementById('mini_maxi'),
    sidebar = document.querySelector('.SN-main-sidebar'),
    sidebar_controls = document.querySelector('.SN-main-sidebar-controls'),
    new_note_btn = document.querySelector('.SN-main-sidebar-controls-plus'),
    note_elements = document.getElementsByClassName('SN-main-sidebar-elem'),
    search = document.querySelector('.search-button'),
    search_mini = false

  const minimize = () => {
    // Icon
    icon.classList.remove('rotate-left')
    icon.classList.add('rotate-right')
    icon.classList.add('animate__animated', 'animate__fadeOut')

    // Sidebar
    sidebar.classList.add('mini-sidebar')

    // Sidebar controls
    sidebar_controls.classList.add('mini-sidebar_controls')

    // New note button
    new_note_btn.classList.add('mini-new_note')

    // notes
    for (let i = 0; i < note_elements.length; i++) {
      note_elements[i].classList.add('mini-notes')
    }
  },
    maximize = () => {
      // Icon
      icon.classList.remove('rotate-right')
      icon.classList.add('rotate-left')
      icon.classList.remove('animate__animated')
      icon.classList.remove('animate__fadeOut')

      // Sidebar
      sidebar.classList.remove('mini-sidebar')

      // Sidebar controls
      sidebar_controls.classList.remove('mini-sidebar_controls')

      // New note button
      new_note_btn.classList.remove('mini-new_note')

      // notes
      for (let i = 0; i < note_elements.length; i++) {
        note_elements[i].classList.remove('mini-notes')
      }

    }

  if (!icon.classList.contains('rotate-right') || search_mini == true) {
    // Minimizing
    minimize()
  } else {
    // Maximizing
    maximize()
  }
  // search.addEventListener('click', () => {
  //   search_mini = true
  //   maximize();
  // })
}

module.exports = {
  write_File,
  Save,
  Delete,
  Create,
  Search,
  DeleteEditor,
  Autosave,
  MiniMaxi
};
