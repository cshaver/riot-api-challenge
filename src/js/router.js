var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var bodyParser = require('body-parser');

app.use( bodyParser.json() );

// serve from public folder
app.use(express.static('public'));

var config = {};

var words = {
  adjectives : ["Doran’s","Bilgewater","Rabadon’s","Nashor’s","Last","Righteous","Trinity","Wooglet’s","Talisman of","Will of the","Ruby","Luden’s","Infinity","The","Mejai’s","Archangel’s","Seraph’s","Greater","Forbidden","Boots of","Tear of the","Wicked","Fed","Siege","Super","Caster","Melee","Ranged","Outer","Inhibitor","Nexus","Excessive","Perma","Definitely Not","Enchanted Crystal","Super Mega","OP","AFK","Better Nerf"],
  nouns      : ["Gromp","Krug","Scuttler","Sentinel","Raptor","Wolf","Brambleback","Dragon","Baron","Buff","Wraith","Vilemaw","Golem","Elixer","Ward","Poro","Boots","Shield","B. F. Sword","Smite","Heal","Ignite","Ghost","Teleport","Needlessly Large Rod","Soulstealer","Minion","Turret","Inhibitor","Nexus","Rito","Jungler","ADC","Smurf","Assist","Kill","Fountain","CC","Tibbers"]
};

var lolapi  = require('lolapi')(config.apiKey, config.region);

lolapi.setRateLimit(10, 500);

// start server listening
http.listen(3000, function(){
  console.log('listening on *:3000');
});

// set up socket.io
io.on('connection', function(socket){
  socket.user = { id : '', nickname : '' };

  socket.on('disconnect', function(){
    console.log(socket.user.nickname + ' left rooms ' + socket.rooms);
    console.log(socket.rooms);
  });

  // join a room
  socket.on('join', function(data){
    console.log(data);
    socket.user = data.user;
    socket.join(data.room.id);

    console.log(socket.user.nickname + ' joined room ' + data.room.id);
    // io.to(data.room.id).emit('users update', io.sockets.clients(data.room.id));
  });
});


// DATABASE stuff
//
// set up MySQL
var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'riotpls'
});

// set up PostgreSQL
var pg = require('pg');
// "postgres://*USERNAME*:*PASSWORD*@*HOST*:*PORT/*DATABASE*"
var connectionString = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" +
                          config.postgres.host + ":" + config.postgres.port + "/" + config.postgres.database + "?ssl=true";

var pgclient = new pg.Client(connectionString);
pgclient.connect();

mysqlConnection.connect();

// endpoints

// join existing room, return id and nickname
app.get('/room/:id', function(req, res){
  var roomParams = roomIdToParams(req.params.id);

  if (roomParams.id){
    var query = "SELECT * FROM rooms WHERE id = " + roomParams.id + ";";
    console.log(query);

    var q = pgclient.query(query, function(err, result){
      if (err){
        console.log(err);
      }
      else {
        var id     = result.rows[0].id,
            random = result.rows[0].random,
            room   = getRoomId(id, random);

        createUser(id, function(user){
          res.send( { room : result.rows[0], user: user } );
        });
      }
    });
  }

  
});

// create new room and new user
app.get('/room', function(req, res){
  console.log('new room');

  var random = getRandomInt();

  var query = "INSERT INTO rooms ( random ) VALUES ( " + random + " ) RETURNING *;";


  var q = pgclient.query(query, function(err, result){
    var id     = result.rows[0].id,
        random = result.rows[0].random,
        room   = getRoomId(id, random);

    createUser(id, function(user){
      res.send( { room : { id : room }, user : user });
    });
  });

});

// remove user from any room
app.get('/user/leave/:id', function(req, res){

  var query = "UPDATE users SET room_id = NULL WHERE id = " + req.params.id + " RETURNING *;";

  var q = pgclient.query(query, function(err, result){
    if (err){
      console.log(err);
    }

    res.send( result.rows );
  });
});

// route endpoints
app.get('/match', function(req, res) {
  
  // shouldnt just do random since its kind slow but HEY its 10AM
  var query = "SELECT * FROM matches WHERE json IS NOT NULL ORDER BY RANDOM() LIMIT 1;";

  var q = pgclient.query(query);

  var results = [];

  q.on('row', function(row) {
    results.push(row);
  });

  q.on('end', function() {
    res.send(cleanJson(results[0].json));
  });

  q.on('error', function(error){
    console.log(error);
  });
});

// send join url to main page and let backbone router handle it
app.get('/join/:id', function(req, res){
  var options = {
    root: __dirname + '/../../public/'
  };

  var fileName = 'index.html';

  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });
});

// send join url to main page and let backbone router handle it
app.get('/champ/:id', function(req, res){

  lolapi.Static.getChampion(req.params.id, { champData : 'image' }, function(error, result){
    if (error) {
      console.log(error);
    }
    else {
      result.image.full   = config.imagePaths.full   + result.image.full;
      result.image.sprite = config.imagePaths.sprite + result.image.sprite;

      res.send(result);
    }
  });

});

// get a row from mysql database connection and write the row to postgresql database
app.get('/migrate', function(req, res) {
  // do stuff

  console.log('Hello!');

  // get rows from mysql
  getMysqlRows(function(){
    res.send('done');
  });

  // insert them into psql
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

function createUser(roomId, callback){

  console.log('create user with joined room');
  var nickname = generateNickname();

  var query = "INSERT INTO users ( room_id, nickname ) VALUES ( " + roomId + ", '" + nickname + "' ) RETURNING *;";

  var q = pgclient.query(query, function(err, result){
    if (err){
      console.log(err);
    }

    var user = { id : result.rows[0].id, nickname : result.rows[0].nickname };

    callback( user );
  });
}

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
function cleanJson(json){
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
  cleaned = cleaned.replace(/"(\w+),":/g, '"$1":');
  cleaned = cleaned.replace(/",(\w+)":/g, '"$1":');
  cleaned = cleaned.replace(/"(\w+),(\w+)":/g, '"$1$2":');

  return cleaned;
}

function getRandomInt(){
  var min = 0;
  var max = config.randomMax;
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRoomId(id, random){
  var string = '' + id + random;
  return parseInt(string, 10).toString(36);
}

function roomIdToParams(roomId){
  var roomIdNum = parseInt(roomId, 36),
      roomIdStr = roomIdNum.toString(),
      random    = roomIdStr.substr(roomIdStr.length + 1 - config.randomDigits),
      id        = roomIdStr.substr(0, (roomIdStr.length + 1 - config.randomDigits));

  return { id : id, random : random };
}

// cool solution http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n) {
  var width = config.randomDigits;
  z = 0;
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function generateNickname(){
  var noun       = words.nouns[Math.floor(Math.random() * (words.nouns.length - 0))];
  var adjective  = words.adjectives[Math.floor(Math.random() * (words.adjectives.length - 0))];

  return adjective + " " + noun;
}