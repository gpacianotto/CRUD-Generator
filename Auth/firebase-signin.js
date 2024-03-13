// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const loginValidator = require('../Helpers/Validators/login-validator');


function signInFirebase(body, res){

    if(!loginValidator.email(body.email)){
        res.json(
          {
            event: "error", 
            code: "Validation Error", 
            message: "Email is not in a correct format"
          }
        );
        return;
    }

    
    
    const auth = getAuth();
    signInWithEmailAndPassword(auth, body.email, body.password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        res.json(user);

        return;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.json({event: "error", code: errorCode, message: errorMessage});
        return;
    });
    return;
}

module.exports = signInFirebase