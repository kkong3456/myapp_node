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



var connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'oneview',
  multipleStatements:true,
});



router.all('/test',function(req,res,next){

    var sql1_1='select * from cscf1 order by TIME desc;';
    var sql2_1='select * from cscf2 order by TIME desc;';

    var completValueArray=[];
    var eventValueArray=[];
    var routeName=['ETC','YIWGS1','GRWGS1','GRWGS2','DAJUN1']
    var cscfArray=['CSCF#1','CSCF#2'];


    connection.query(sql1_1 + sql2_1 ,function(err,result,fields){

      if(err) throw err;
      var result1=result[0];  //sql1_1의 결과값
      var result2=result[1];

      //console.log(result1);

      //for(var i=0;i<result1.length;i++){
      for (var i=0;i<2;i++){  //j는 CSCF, i는 내림차순 시간 순서
        for(var j=0;j<2;j++){
          if(result[j][i].YIWGS1_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' YIWGS1 ('+result1[i].YIWGS1_C+'%)');
          }
          if(result[j][i].GRWGS1_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' GRWGS1 ('+result1[i].GRWGS1_C+'%)');
          }
          if(result[j][i].GRWGS2_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' GRWGS2 ('+result1[i].GRWGS2_C+'%)');
          }
          if(result[j][i].DAJUN1_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' DAJUN1 ('+result1[i].GRWGS2_C+'%)');
          }
        } //for end
      } // for end
      res.render('test',{title:'cscf1',result1:result1,eventValueArray:eventValueArray});
    });//connction.query end
});

router.all('/ajax1',function(req,res,next){
  var sql1_1='select * from cscf1;';
  //connection.connect();
  connection.query(sql1_1,function(err,result){

    res.send(result);  //send로 배열을 전달
  });
});

router.all('/ajax2',function(req,res,next){
  var sql2_1='select * from cscf2;';
  connection.query(sql2_1,function(err,result){
    res.send(result);
  });
});

router.all('/eventAjax',function(req,res,next){

    var sql1_1='select * from cscf1 order by TIME desc;';
    var sql2_1='select * from cscf2 order by TIME desc;';

    var completValueArray=[];
    var eventValueArray=[];
    var routeName=['ETC','YIWGS1','GRWGS1','GRWGS2','DAJUN1']
    var cscfArray=['CSCF#1','CSCF#2'];

    connection.query(sql1_1 + sql2_1 ,function(err,result,fields){
      if(err) throw err;
      var result1=result[0];  //sql1_1의 결과값
      var result2=result[1];

      //console.log(result1[0]);

      //for(var i=0;i<result1.length;i++){
      for (var i=0;i<2;i++){  //j는 CSCF, i는 내림차순 시간 순서
        for(var j=0;j<2;j++){
          if(result[j][i].YIWGS1_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' YIWGS1 ('+result1[i].YIWGS1_C+'%)<br>');
          }
          if(result[j][i].GRWGS1_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' GRWGS1 ('+result1[i].GRWGS1_C+'%)<br>');
          }
          if(result[j][i].GRWGS2_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' GRWGS2 ('+result1[i].GRWGS2_C+'%)<br>');
          }
          if(result[j][i].DAJUN1_C<70){
            eventValueArray.push(cscfArray[j]+' '+result1[i].TIME+' DAJUN1 ('+result1[i].GRWGS2_C+'%)<br>');
          }
        } //for end
      } // for end
      res.send(eventValueArray);
    });//connction.query end
});

router.get('/wgs',function(req,res,next){
  var sql1_1='select * from cscf1 order by TIME desc;';
  var sql2_1='select * from cscf2 order by TIME desc;';

  connection.query(sql1_1 + sql2_1 ,function(err,result,fields){
    if(err) throw err;
    var result1=result[0];  //sql1_1의 결과값
    var result2=result[1];

    res.render('wgs',{title:'wgs',result1:result1,result2:result2});
  });
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
