// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const {getAuth, createUserWithEmailAndPassword} = require("firebase/auth");
const User = require('../Models/user');

const loginValidator = require('../Helpers/Validators/login-validator');

function signUpFirebase(body, res){

    if(!loginValidator.email(body.email)){
      res.json(
        {
          event: "error", 
          code: "Validation Error", 
          message: "Email is not in a correct format"
        }
      )
    }

    if(!loginValidator.password(body.password))
    {
      res.json(
        {
          event: "error", 
          code: "Validation Error", 
          message: "Password must be at least 8 characters long"
        }
      )
    }

    if(!loginValidator.role(body.role))
    {
      res.json(
        {
          event: "error", 
          code: "Validation Error", 
          message: "User Roles allowed: 'root', 'admin', 'common-user'"
        }
      )
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, body.email, body.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const objectSend = {
          fireBaseUid: user.uid,
          role: body.role,
          fullName: body.fullName,
          birthDate: body.birthDate,
          active: body.active,
          website: body.website,
          fireBaseEmail: user.email
        }

        User.create(objectSend).then((p) => {
          res.json(p);
        }).catch((err) => {
          res.json(err);
        });
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