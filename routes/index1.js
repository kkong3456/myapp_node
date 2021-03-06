var express = require('express');
var router = express.Router();
var fs=require('fs');
var app=express();



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
app.locals.myVar='ajax';
router.all('/test',function(req,res,next){
  console.log('ss');
  eventHistoryArray=[];
  setInterval(getNewCompleteData,6000);
  res.render('test',{title:'ajax',eventHistoryArray:eventHistoryArray});
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
