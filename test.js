var fs=require('fs');

fs.readFile('public/complete_ratio.json','utf-8',function(error,data){
  console.log(data);
});
