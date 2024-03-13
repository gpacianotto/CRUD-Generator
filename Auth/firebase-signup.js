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
      return;
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
      return;
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
      return;
    }

    if(!loginValidator.parentId(body.parentId))
    {
      res.json(
        {
          event: "error", 
          code: "Validation Error", 
          message: "Parent ID invalid"
        }
      )
      return;
    }

    if(loginValidator.parentId(body.parentId))
    {
      User.findAll({where: {id: body.parentId}}).then((parent) => {
        

        if(parent.length < 1)
        {
          res.json(
            {
              event: "error", 
              code: "Context Error", 
              message: "Your parent ID is not valid or doesn't exist"
            }
          )
          return;
        }

        if(parent.length > 1)
        {
          res.json(
            {
              event: "error", 
              code: "Context Error", 
              message: "Your parent ID is duplicated, please contact the admnistrators"
            }
          )
          return;
        }
          }).catch((err) => {
            res.json(err);
            return;
          });
        }
        return;

}

module.exports = signUpFirebase