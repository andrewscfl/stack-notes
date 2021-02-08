
const compile_code = (lang, code) => {
    const compile_prom = new Promise((resolve, reject) => {
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
            .then(res => {
                resolve(res);
            });
    });
return compile_prom;

}

module.exports = {
    compile_code
};
