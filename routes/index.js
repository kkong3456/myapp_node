var express = require('express');
var router = express.Router();
var fs=require('fs');
var app=express();
var mysql=require('mysql');
var SSH=require('simple-ssh');
var cors=require('cors');

app.use(cors());

//날자변환 모듈
Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";
    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        }
      });
};
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSCF#1' });
  next();
});

//폭주호 정보 가져오기
var ssh=new SSH({
  host:'172.21.223.117',
  user:'root',
  pass:'cheerup1LTAS!'
});

//Home Virtual Server
var ssh1=new SSH({
  host:'172.30.1.23',
  user:'kkong',
  pass:'rmfltmeh',
  //timeout:5000,
})



var connection=mysql.createConnection({
  host:'localhost',
  user:'nodejs',
  password:'rmfltmeh',
  database:'oneview',
  multipleStatements:true,
});

var stdout='xxx';
function runAway(){

  return stdout;
}
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


      for (var i=0;i<5;i++){  //j는 CSCF, i는 내림차순 시간 보여줄(개수)
        for(var j=0;j<2;j++){
          if(result[j][i].YIWGS1_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' YIWGS1 ('+result[j][i].YIWGS1_C+'%) 완료율 저하');
            console.log(result[j][i]);
          }
          if(result[j][i].GRWGS1_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' GRWGS1 ('+result[j][i].GRWGS1_C+'%) 완료율 저하');
          }
          if(result[j][i].GRWGS2_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' GRWGS2 ('+result[j][i].GRWGS2_C+'%) 완료율 저하');
          }
          if(result[j][i].DAJUN1_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' DAJUN1 ('+result[j][i].DAJUN1_C+'%) 완료율 저하');
          }
        } //for end
      } // for end

      res.render('test',{title:'cscf1',result1:result1,eventValueArray:eventValueArray});
    });//connction.query end
});
//폭주
router.all('/runAwayAjax',function(req,res,next){
  ssh1.exec('tail -n2 /home/kkong/runAwayCall.txt',{
     out:function(stdout){
      try{
        //console.log(stdout);
        stdout=stdout.split(':');
        xxx=stdout[1].split('Out');
        res.send('<b>착신폭주호</b>'+xxx[0]+'<br><b>발신폭주호</b>'+stdout[2]); //stdout[1]는 Out Call 문자열

        ssh1.reset();  //stdout이 누적되어 출력되어 리셋
      }catch(err){stdout=''}
    },
  }).start();

});

//CSCF#1 그래프
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
      for (var i=0;i<5;i++){  //j는 CSCF, i는 내림차순 시간 순서
        for(var j=0;j<2;j++){
          if(result[j][i].YIWGS1_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' YIWGS1 ('+result[j][i].YIWGS1_C+'%) 완료율 하락<br>');
          }
          if(result[j][i].GRWGS1_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' GRWGS1 ('+result[j][i].GRWGS1_C+'%) 완료율 하락<br>');
          }
          if(result[j][i].GRWGS2_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' GRWGS2 ('+result[j][i].GRWGS2_C+'%) 완료율 하락<br>');
          }
          if(result[j][i].DAJUN1_C<65){
            eventValueArray.push(cscfArray[j]+' '+result[j][i].TIME+' DAJUN1 ('+result[j][i].DAJUN1_C+'%) 완료율 하락<br>');
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

router.get('/autodb',function(req,res,next){

  setInterval(function(){
    var date=new Date();
    console.log(date.format('yyMMddHHmmss'));
  },60000);


  //var val=Math.random()*100
//  var sql='insert into cscf1 values()'

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
