const compile_code = (lang, code) => {

    let fetchObj = {
        "language": `${lang}`,
        "source": `${code}`,
    };

    fetch('https://emkc.org/api/v1/piston/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchObj)
    })
    .then(res => res.json())
    .then(res => console.log("RAN CODE HERE: " + JSON.stringify(res)));

}

module.exports = {
    compile_code
};
