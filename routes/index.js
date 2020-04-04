var express = require('express');
var router = express.Router();
var fs=require('fs');
var app=express();
var mysql=require('mysql');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSCF#1' });
  next();
});

var eventHistoryArray=new Array();

function getNewCompleteData(){
  fs.readFile('./public/complete_ratio.json','utf8',function(err,data){
    if(err){
      console.log("Failed to open Config File");
    }else{
      var data=data.toString();
      var result=JSON.parse(data);

      result.TIME.unshift('TIME');
      result.YIWGS1.unshift('YIWGS1');
      result.YIWGS1L.unshift('YIWGS1L');
      result.GRWGS1.unshift('GRWGS1');
      result.GRWGS1L.unshift('GRWGS1L');
      result.GRWGS2.unshift('GRWGS2');
      result.GRWGS2L.unshift('GRWGS2L');

      var newTimeItem=result.TIME[result.TIME.length-1];
      var headYIWGS1Item=result.YIWGS1[0];
      var newYIWGS1Item=result.YIWGS1[result.YIWGS1.length-1];

      var headGRWGS1Item=result.GRWGS1[0];
      var newGRWGS1Item=result.GRWGS1[result.GRWGS1.length-1];

      var headGRWGS2Item=result.GRWGS2[0];
      var newGRWGS2Item=result.GRWGS2[result.GRWGS2.length-1];

      var wgsName=new Array(headYIWGS1Item,headGRWGS1Item,headGRWGS2Item);
      var newCompletValue=new Array(newYIWGS1Item,newGRWGS1Item,newGRWGS2Item);

      var animationCnt='F';
      console.log('yyy');
      for(var i=0;i<newCompletValue.length;i++){
         if(newCompletValue[i]<60){  //완료율 60이
           var warningMsg=`${newTimeItem} CSCF#1 ${wgsName[i]} 완료율 하락!! (${newCompletValue[i]})`+'<br>\n';
           eventHistoryArray.unshift(warningMsg);

         }
         if(eventHistoryArray.length>4){
           eventHistoryArray.pop(); //배열에서 제일 뒤의 값을 삭제
           //eventHistoryArray.pop();
         }
      }



      //배열을 파일에
        fs.writeFile('./public/event.txt',eventHistoryArray,'utf8',function(err){
          if(err){throw err};
        //  console.log('OK');
        });
      //}
    } //else
  });
}//getNewCompleteData
// function dqConnect(){
//   var connection=mysql.createConnection({
//     host:'localhost',
//     user:'nodejs',
//     password:'rmfltmeh',
//     database:'oneview',
//   //  port:3307,
//   });
//   console.log('aa');
//
//   connection.connect();
//   connection.query('select * from route',function(err,results,fields){
//     //console.log(results);
//     res.send(results);
//   });
//   connection.end();
// }

var connection=mysql.createConnection({
  host:'localhost',
  user:'nodejs',
  password:'rmfltmeh',
  database:'oneview',
//  port:3307,
});
router.all('/test',function(req,res,next){

  connection.connect();
  connection.query('select * from route',function(err,results,fields){
    // if(err) throw err;
    res.render('test',{title:'ajax',results:results});
    //console.log(results);


  });

  //res.render('test',{title:'ajax'});
  //res.send(results);
});

router.all('/ajax',function(req,res,next){
  var connection=mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password:'rmfltmeh',
    database:'oneview',
  });

  connection.connect();
  connection.query('select * from route',function(err,results){
    console.log('xxx');
    res.send({result:results});
    //res.send(results);
  });
});







router.get('/cscf1',function(req,res,next){
  res.render('cscf1',{title:'CSCF#1'});
  next();
});

router.get('/cscf2',function(req,res,next){
  res.render('cscf2',{title:'CSCF#2'});
  next();
});

router.get('/cscf3',function(req,res,next){
  res.render('cscf3',{title:'CSCF#3'});
  next();
});

router.get('/cscf4',function(req,res,next){
  res.render('cscf4',{title:'CSCF#4'});
  next();
});

router.get('/cscf5',function(req,res,next){
  res.render('cscf5',{title:'CSCF#5'});
  next();
});

router.get('/vcscf1',function(req,res,next){
  res.render('vcscf1',{title:'vCSCF#1'});
  next();
});

router.get('/vcscf2',function(req,res,next){
  res.render('vcscf2',{title:'vCSCF#2'});
  next();
});

module.exports = router;
