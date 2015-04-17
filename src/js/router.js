var https   = require('https');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use( bodyParser.json() );

// serve from public folder
app.use(express.static('public'));

var config = {};

// start server listening
var server = app.listen(3002, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

// set up MySQL
var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'riotpls'
});

var pg = require('pg');
// "postgres://*USERNAME*:*PASSWORD*@*HOST*:*PORT/*DATABASE*"
var connectionString = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" +
                          config.postgres.host + ":" + config.postgres.port + "/" + config.postgres.database + "?ssl=true";

var pgclient = new pg.Client(connectionString);
pgclient.connect();

mysqlConnection.connect();

// endpoints

//   MIGRATE - 
//      get a row from mysql database connection
//      write the row to postgresql database
// 

app.get('/migrate', function(req, res) {
  // do stuff

  console.log('Hello!');

  // get rows from mysql
  getMysqlRows(function(){
    res.send('done');
  });

  // insert them into psql
});

// route endpoints
app.get('/match', function (req, res) {
  
  var query = "SELECT * FROM matches WHERE json IS NOT NULL AND cleaned = 2 LIMIT 1;";

  var q = pgclient.query(query);

  var results = [];

  q.on('row', function(row) {
    results.push(row);
  });

  q.on('end', function() {
    console.log('/match');
    res.send(results[0].json);
  });

  q.on('error', function(error){
    console.log(error);
  });
});

app.get('/cleaner', function (req, res) {
   
  mysqlConnection.query('SELECT * FROM matches WHERE json IS NOT NULL AND cleaned = 1 LIMIT 1000;', function(err, rows, fields) {
    if (err) throw err;

    console.log('selected ' + rows.length + ' rows.');
    for (var i = 0; i < rows.length; i++){
      var json = cleanJson(rows[i].id, rows[i].json);
      insert(rows[i].id, json);
    }

    res.send(true);
  });
});

app.post('/match', function(req, res) {
  console.log(req.body);
});


// helper functions used by endpoints

// get row from mysql database
function getMysqlRows(callback){
  console.log('get mysql');

  mysqlConnection.query('SELECT * FROM matches WHERE cleaned = 2 LIMIT 1;', function(err, rows, fields) {
    if (err) throw err;

    console.log('MYSQL grabbing ' + rows.length + ' rows.');

    insertPostgres(rows, callback);
  });
}

// insert row into postgresql database
function insertPostgres(array, callback){
  console.log('insert postgres');
  var query = "INSERT INTO matches (id, json, cleaned) VALUES ";

  for (var i = 0; i < array.length; i++){
    query = query + "( " + array[i].id + ", '" + array[i].json + "', " + array[i].cleaned + " ),";
    updateCleaned(array[i].id);
  }

  query = query.slice(0, - 1) + ";";

  var q = pgclient.query(query);

  var results = [];

  q.on('row', function(row) {
    results.push(row);
  });

  q.on('end', function() {
    console.log('POSTGRES');
    callback();
  });

  q.on('error', function(error){
    console.log(error);
  });
}

// update mysql row to mark that it's been migrated
function updateCleaned(id){
  console.log('update cleaned');

  var query = "UPDATE matches SET cleaned = 3 WHERE id = " + id + ";";

  mysqlConnection.query(query, function (err, result) {
    if (err) throw err;

    console.log('MYSQL    changed ' + result.changedRows + ' rows');

  });
}

// clean json to make valid
function cleanJson(id, json){
  var reg = /\{,|,,|:,|:\d+,\d+,|\[,/g;

  cleaned =    json.replace(/\{,/g, '{');
  cleaned = cleaned.replace(/,\}/g, '}');
  cleaned = cleaned.replace(/,,/g, ',');
  cleaned = cleaned.replace(/:,/g, ':');
  cleaned = cleaned.replace(/,:/g, ':');
  cleaned = cleaned.replace(/:(\d+),(\d+),/g, ':$1$2,');
  cleaned = cleaned.replace(/:(\d+),(\d+)\}/g, ':$1$2}');
  cleaned = cleaned.replace(/:-?(\d+),(\d+\.?\d+),/g, ':$1$2,');
  cleaned = cleaned.replace(/:-?(\d+),(\d+\.?\d+)\}/g, ':$1$2}');
  cleaned = cleaned.replace(/:-?(\d+\.?\d+),(\d+),/g, ':$1$2,');
  cleaned = cleaned.replace(/:-?(\d+\.?\d+),(\d+)\}/g, ':$1$2}');
  cleaned = cleaned.replace(/\[,/g, '[');
  cleaned = cleaned.replace(/\,]/g, ']');

  return cleaned;
}