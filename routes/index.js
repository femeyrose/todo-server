var express = require('express');
var router = express.Router();
const dataService=require('../services/data.service')

/* GET home page. */
router.get('/', function(req, res, next) {
  dataService.getTodos()
  .then(todos=>{
    res.json(todos);
  })
});
//get in the postman will gives the created and updated time listing

router.post('/',function(req,res,next){
  let data=req.body;
  data.userId = req.user_id; //user_id passed from data.services-->verifyToken
  const result=dataService.createTodo(data);
  res.status(result.statusCode).json(result);

});

//we have to post this in the postman
//the route is given to 3002/ ('/')

module.exports = router;

//here in index.js we define the router (viewed in the browser)

