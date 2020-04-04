var mysql=require('mysql');

var connection=mysql.createConnection({
  host:'localhost',
  user:'nodejs',
  password:'rmfltmeh',
  database:'oneview',
});

connection.connect();
connection.query('select * from route',function(err,results){
  console.log('xxx');
  res.send({value:results});
});
