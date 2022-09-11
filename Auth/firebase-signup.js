// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const {getAuth, createUserWithEmailAndPassword} = require("firebase/auth");

function signUpFirebase(body, res){


    const auth = getAuth();
    createUserWithEmailAndPassword(auth, body.email, body.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        res.json(user);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        res.json({event: "error", code: errorCode, message: errorMessage});
        // ..
      });


    //res.json({email: body.email, senha: body.password});

}

module.exports = signUpFirebase