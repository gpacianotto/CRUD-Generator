function nameSystemValidation(name) {

    const exp = /([a-zA-Z]*-*)*/;
    
    return exp.test(name);

}

function urlValidation(url) {
    const exp = /(http|https):\/\/([a-zA-Z]*[0-9]*)/

    return exp.test(url);
}

const Systems = require("../Models/systems");
const hashing = require('js-sha256');

async function newSystem(body, res)
{
    const name = body?.name;
    const urlFront = body?.urlFront;
    const urlBack = body?.urlBack; //será gerado pelo sistema
    const framework = body?.framework;
    const lang = body?.lang;
    
    
    if(!name)
    {
        res.json({
            event: "error", 
            code: "Validation Error", 
            message: "name is Required!"
            })
        return;
    }

    if(!nameSystemValidation(name))
    {
        res.json({
            event: "error", 
            code: "Validation Error", 
            message: "Name is not valid, should not have spaces, only '-' are supported"
            })
        return;
    }

    const now = new Date().toString();

    const systemToken = hashing.sha256(name + now);

    await Systems.create({
        name: name,
        urlFront: urlFront,
        urlBack: "localhost:3000",
        framework: framework,
        lang: lang,
        systemToken: systemToken
    }).then((response) => {
        res.json({
            message: "System created successfully!",
            response: response
        });
        return;
    }).catch((error) => {
        res.json({
            event: "error", 
            code: "Fatal Error", 
            message: "There was an error while trying to create your system"
            })
    })

} 

module.exports = newSystem;