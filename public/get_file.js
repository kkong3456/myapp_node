var fs=require('fs');
var dataBuffer=fs.readFileSync('c3_test.json');
var dataJson=dataBuffer.toString();
console.log(dataJson);