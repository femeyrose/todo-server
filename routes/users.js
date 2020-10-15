var express = require('express');
const dataService = require('../services/data.service');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',function(req,res,next){
  dataService.createUser(req.body)
  .then(result=>{
    res.status(result.statusCode).json(result);
  })
})

//note in app.js ----app.use('/users', usersRouter);----user route is defined

router.post('/login',function(req,res,next){
  dataService.login(req.body)
  .then(result=>{
    res.status(result.statusCode).json(result);
  })
})




module.exports = router;
