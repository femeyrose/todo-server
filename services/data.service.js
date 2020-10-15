const dbTodo = require('../models/Todo')
const dbUser=require('../models/User')
const salt="jhjbjbjbjhh";
const crypto=require('crypto')
//crypto is a module
//using this hashing is done

const jwt= require('jsonwebtoken');
//jwt token module

const jwtSecret="verysecretoken";


const getTodos=()=>{
    return dbTodo.Todo.find();
}

//getTodo is a promise like .then



const createTodo=(data)=>{
    const todo=new dbTodo.Todo(data);
    todo.save()
    .then(d=>{
console.log(d);
    })
    .catch(err=>{
console.log(err);
    });

    //to check the error

    return{
        statusCode:200,
        message:"Todo created succesfully"
    }
}

//to verify token after passing token in the app.js
const verifyToken=(bearerToken,req,res,next)=>{
    jwt.verify(bearerToken,jwtSecret,function(err,decoded){
        if(err){
       res.status(401).json({message:"invalid token"});

        }
        else{
            req.user_id = decoded.id; //to find the user using the id we get after req
            next();
        
        }
    })
}
//export this and declare the dataservice module in app.js
//define in the tokenHeader of authmiddleware
//to check this, click send in http://localhost:3002 and check the token in cmd
//we get the id of the user we given along with the token in cmd (decoded) console.log(decoded.id)
//to check , click send, todo created successfully, if any changes to token created--invalid token is displayed


const login = (data) => {
    return dbUser.User.findOne({ email: data.email }) //give this in return , then only users.js work
        .then(user => {
            if (!user) {
                return {
                    statusCode: 422,
                    message: "Invalid credentials"
                }

            }
          const hash=generateHash(data.password);
          if(hash==user.password){ //checking user.password and the generated password (using hash) are same
            const token =jwt.sign({id:user._id},jwtSecret)
            //this token should be very secret and should not pass
            //when login send in postman, we get token
            //after this we have to store the token to localstorage in the front end 
            //"verysecretoken" (jwtSecret) token is normally not shared and usually given as random and shouldnot share

            return {
                token,
                statusCode: 200,
                message: "Logged In"
            }
          }
          else{
            return {
                statusCode: 422,
                message: "Invalid credentials"
            }
          }

        })
}
//for validation of login
//we can seen in db that the password is converted to string 
//so whoever hack the the db wont able to get the password
//in postman password:"12345"

const generateHash=(password)=>{
    const hash=crypto.pbkdf2Sync(password,salt,1000,64,'sha512').toString('hex');
    return hash;
}

const createUser=(data)=>{
  return  dbUser.User.findOne({email:data.email}) //give this in return , then only users.js work
    .then(user=>{
        if(user){
            return{
                statusCode:422,
                message:"user already exists"
            }
        }
      const hash=generateHash(data.password);
      //console.log(hash)

      //hashing is used to create pwd, we use string as pwd, sha alogirthm is used
      //'salt' is the second parameter used
      //1000 is the iteration
      //64 is the key length
      //result is converted to string

          data.password=hash;
          //data is stored in pwd now

        const newUser=new dbUser.User(data);
        newUser.save();
        return {
        statusCode:422,
        message:"user created succuessfully"
        }
    })
}


module.exports={
    createTodo,
    getTodos,
    createUser,
    login,
    verifyToken
}

//instead of session authentication here we are using JWT token
//npm i jsonwebtoken