var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

var bodyParser = require('body-parser');

app.use( bodyParser.json() );

// serve from public folder
app.use(express.static('public'));

var config = {
  "apiKey": process.env.API_KEY,
  "region": "na",

  "chunkTiming": 1000,
  "chunkSize": 35,


  "do_cache": true,
  "caching": {
    "allowedTimeBasic": 43200000,
    "checkTimeBasic": 3600000,
    "allowedTimeSQL": 900000,
    "checkTimeSQL": 60000
  },

  "ignoreFatal": false,

  "randomMax"    : 100000,
  "randomDigits" : 6,

  "imagePaths" : {
    "sprite" : "http://ddragon.leagueoflegends.com/cdn/5.7.1/img/sprite/",
    "full"   : "http://ddragon.leagueoflegends.com/cdn/5.7.1/img/champion/"
  }
};

var words = {
  adjectives : ["Doran’s","Bilgewater","Rabadon’s","Nashor’s","Last","Righteous","Trinity","Wooglet’s","Talisman of","Will of the","Ruby","Luden’s","Infinity","The","Mejai’s","Archangel’s","Seraph’s","Greater","Forbidden","Boots of","Tear of the","Wicked","Fed","Siege","Super","Caster","Melee","Ranged","Outer","Inhibitor","Nexus","Excessive","Perma","Definitely Not","Enchanted Crystal","Super Mega","OP","AFK","Better Nerf","Unstoppable","Cosplaying","Chat Restricted","Diamond","Bronze League","Calculated","Lagging","IRL","Bugged","Hyped","Dark, Secret"],
  nouns      : ["Gromp","Krug","Scuttler","Sentinel","Raptor","Wolf","Brambleback","Dragon","Baron","Buff","Wraith","Vilemaw","Golem","Elixer","Ward","Poro","Boots","Shield","B. F. Sword","Smite","Heal","Ignite","Ghost","Teleport","Needlessly Large Rod","Soulstealer","Minion","Turret","Inhibitor","Nexus","Rito","Jungler","ADC","Support","Smurf","Assist","Kill","Fountain","CC","Tibbers","Donger","GG"]
};

var lolapi  = require('lolapi')(config.apiKey, config.region);

lolapi.setRateLimit(10, 500);

// start server listening
http.listen(server_port, function(){
  console.log('listening on *:' + server_port);
});

// set up socket.io
io.on('connection', function(socket){
  socket.user = { id : '', nickname : '' };

  socket.on('disconnect', function(){
    socket.joinedRooms = socket.joinedRooms || [];
    socket.user = socket.user || { nickname : '' };
    console.log(socket.user.nickname + ' left ' + socket.joinedRooms.length + ' rooms');
    updateRooms(socket.joinedRooms);
  });

  // join a room
  socket.on('join', function(data){
    if (data.user && data.room){
      socket.user = data.user;
      socket.join(data.room.id);
      socket.join('some room');
      socket.joinedRooms = socket.joinedRooms || [];
      socket.joinedRooms.push(data.room.id);

      console.log(socket.user.nickname + ' joined room ' + data.room.id);

      io.to(data.room.id).emit('users', { users : getUserList(data.room.id) } );
    }
  });

  // fetch the same game
  socket.on('fetch game', function(data){
    console.log('fetch game ' + data.matchId );
    console.log(data);
    if (data.room){
      console.log(data.room);
      io.to(data.room.id).emit('fetch game', { matchId : data.matchId } );
    }
  });

  // play the game
  socket.on('play game', function(data){
    console.log('play game ' + data.matchId );
    console.log(data);
    if (data.room){
      console.log(data.room);
      io.to(data.room.id).emit('play game', { matchId : data.matchId } );
    }
  });

});

function updateRooms(roomList){
  for (var id in roomList) {
    io.to(roomList[id]).emit('users', { users : getUserList(roomList[id]) } );
  }
}

function getUserList(roomName){
  var namespace = '/';
  var userList = [];
  for (var socketId in io.nsps[namespace].adapter.rooms[roomName]) {
    var s = io.sockets.connected[socketId];
    userList.push(s.user);
  }
  return userList;
}

// set up PostgreSQL
var pg = require('pg');
var dbUrl = process.env.DATABASE_URL + '?ssl=true';

// endpoints

// join existing room, return id and nickname
app.get('/room/:id', function(req, res){
  var roomParams = roomIdToParams(req.params.id);

  if (roomParams.id){
    var query = "SELECT * FROM rooms WHERE id = " + roomParams.id + ";";
    console.log(query);

    pg.connect(dbUrl, function(err, client, done){
      var handleError = function(err){
        if(!err) return false;

        done(client);
        res.end('An error occurred');
        return true;
      };

      client.query(query, function(err, result){
        if (handleError(err)) return;

        var id     = result.rows[0].id,
            random = result.rows[0].random,
            roomId   = getRoomId(id, random);

        createUser(id, function(user){
          res.send( { room : { id : roomId }, user: user } );
        });
      });
    });
  }

  
});

// create new room and new user
app.get('/room', function(req, res){
  console.log('new room');

  var random = getRandomInt();

  var query = "INSERT INTO rooms ( random ) VALUES ( " + random + " ) RETURNING *;";

  pg.connect(dbUrl, function(err, client, done){
    var handleError = function(err){
      if(!err) return false;
      
      done(client);
      res.end('An error occurred');
      return true;
    };

    client.query(query, function(err, result){
      if(handleError(err)) return;

      var id     = result.rows[0].id,
          random = result.rows[0].random,
          room   = getRoomId(id, random);

      createUser(id, function(user){
        res.send( { room : { id : room }, user : user });
      });
    });
  });

});

// remove user from any room
app.get('/user/leave/:id', function(req, res){

  var query = "UPDATE users SET room_id = NULL WHERE id = " + req.params.id + " RETURNING *;";

  pg.connect(dbUrl, function(err, client, done){
    var handleError = function(err){
      if(!err) return false;
      
      done(client);
      res.end('An error occurred');
      return true;
    };

    client.query(query, function(err, result){
      if(handleError(err)) return;

      res.send( result.rows );
    });
  });
});

// route endpoints
app.get('/match', function(req, res) {
  console.log('get random match');
  
  // shouldnt just do random since its kind slow but HEY its 10AM
  // var query = "select * from matches limit 1 ;";
  var query = "select * from matches offset random() * (select count(*) from matches) limit 1 ;";

  pg.connect(dbUrl, function(err, client, done){
    var handleError = function(err){
      if(!err) return false;
      
      done(client);
      res.end('An error occurred');
      return true;
    };
    
    client.query(query, function(err, result){
      if(handleError(err)) return;

      res.send(cleanJson(result.rows[0].json));
    });
  });
});

// route endpoints
app.get('/match/:id', function(req, res) {
  console.log('get specific match');
  
  // shouldnt just do random since its kind slow but HEY its 10AM
  var query = "select * from matches WHERE id = " + req.params.id + " limit 1 ;";
  // var query = "select * from matches offset random() * (select count(*) from matches) limit 1 ;";

  pg.connect(dbUrl, function(err, client, done){
    var handleError = function(err){
      if(!err) return false;
      
      done(client);
      res.end('An error occurred');
      return true;
    };
    
    client.query(query, function(err, result){
      if(handleError(err)) return;

      res.send(cleanJson(result.rows[0].json));
    });
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

// helper functions used by endpoints

function createUser(roomId, callback){

  var nickname = generateNickname();
  console.log('create user ' + nickname + ' with joined room');

  var query = "INSERT INTO users ( room_id, nickname ) VALUES ( " + roomId + ", '" + nickname + "' ) RETURNING *;";

  pg.connect(dbUrl, function(err, client, done){
    var handleError = function(err){
      if(!err) return false;
      
      done(client);
      res.end('An error occurred');
      return true;
    };

    client.query(query, function(err, result){
      if(handleError(err)) return;

      var user = { id : result.rows[0].id, nickname : result.rows[0].nickname };

      callback( user );
    });
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