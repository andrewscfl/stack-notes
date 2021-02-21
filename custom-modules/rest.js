const { ipcMain } = require("electron");
const { fstat } = require("fs");

const url = "http://ec2-3-139-109-240.us-east-2.compute.amazonaws.com:3000";
//this will need to be updated when we have the rest api built and working

const updates_get = () => {
    fetch(`${url}/update`).then(res => res.json()).then((res) => {
        if (res.success) {
            console.log(res);
            updates_compare_versions(res.data.note, ()=>{
                updates_build_slide_over(res.data.title, res.data.desc);
            })
        }
    });
}

const updates_compare_versions = (version, callback) => {
    let versionpull = ipc.sendSync('update-version', version);
    if(versionpull.success){
        if(versionpull.newVersion){
            callback();
        }
    }
}

const updates_build_slide_over = (h2_here, body_here) => {
    let template = `
    <div class="side-update" style="
    position: fixed;
    background-color: #ffffffb5;
    padding: 10px 20px;
    z-index: 9999999;
    bottom: 10px;
    right: 10px;
    border-radius: 5px;
">
    <div class="side-close" style="
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-family : Arial,Helvetica,sans-serif;
    ">X</div>
    <h2 style="font-family: monospace;">${h2_here}</h2>
    <p>${body_here}</p>
    </div>
    `;
    let elem = document.createElement('div');
    elem.innerHTML = template;
    document.body.appendChild(elem);
    document.querySelector('.side-close').addEventListener('click', ()=>{
        document.querySelector('.side-update').remove();
    });
}

module.exports = {
    updates_get,
};