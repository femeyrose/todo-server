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

router.get('/:id', function(req, res, next) {
  dataService.getTodo(req.params.id)
  .then(todo=>{
    res.json(todo);
  })
});
//this is for editing the contents(name and desc) corresponds to a particular id
//also define getTodo in data.service
//to check this in postman, click send  in http://localhost:3002 (get method) and then copy an id then click send
//in http://localhost:3002/:id, we get the content of that id

router.post('/',function(req,res,next){
  let data=req.body;
  data.userId = req.user_id; //user_id passed from data.services-->verifyToken
  const result=dataService.createTodo(data);
  res.status(result.statusCode).json(result);

});

router.put('/:id',function(req,res,next){
  let data=req.body;
  dataService.updateTodo(req.params.id,data)
  .then(data=>{
    res.status(200).json({
      message:"Todo updated successfully"
    });
  });
});
//for update/edit we use put
//to check this, first send get fn in postman and then copy the id to the new put fn tab
//change the contents in the body, check content changed in the get tab
//note:any error such as "authentication failed" appears, add bearer token under Authentication


router.delete('/:id',function(req,res,next){
  dataService.deleteTodo(req.params.id)
  .then(data=>{
    res.status(200).json({
      message:"Todo deleted successfully"
    });
  });
});


//we have to post this in the postman
//the route is given to 3002/ ('/')

module.exports = router;

//here in index.js we define the router (viewed in the browser)


