'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
//var util = require('util');
var express = require('express');
//var usergrid = require('usergrid');
//var config = require('./config');

var app = express();

var UsergridClient = require('../../node_modules/usergrid/lib/client')
var usergrid = new UsergridClient
({
    "appId": "sandbox",
    "orgId": "nguyenvu2589",
    "baseUrl": 'https://apibaas-trial.apigee.net',
    "clientId": "b3U6fmmHJgxjEeeUYxIuBzeXfQ",
    "clientSecret": "b3U6BLnQe6NwhHmMOEIxwMqrLipzMsY"
})
// usergrid.init({
//   orgId: 'nguyenvu2589',
//   appId: 'sandbox',
//   baseUrl: 'https://apibaas-trial.apigee.net',
 
// })

// // DO NOT USE !!!!

// usergrid.setAppAuth('b3U6fmmHJgxjEeeUYxIuBzeXfQ', 'b3U6BLnQe6NwhHmMOEIxwMqrLipzMsY')
// usergrid.authenticateApp(function(error, usergridResponse, token) {
//   if (usergridResponse.ok){
//       console.log("connected!")
//   }
//   else
//   {
//     console.log("FAil to connect !!!")
//   }
// })

module.exports = {
  getAll : getAll,
  save   : save,
  getOne : getOne,
  update : update,
  delete_movie: delete_movie,
};

function getAll(req, res, next){

  usergrid.GET('movies', function(error, usergridResponse, entities) {
    // print out to console to test.
    //console.log(usergridResponse.entities);
    if (usergridResponse.ok){
      res.status(200).json(usergridResponse.entities);
    }
    else
    {
      res.status(404).json("Cant pull info! Contact admin");
    }
  })
}

function save(req, res, next) {
  var info = req.swagger.params.title.value;

  var entity = {
    type: 'movies',
    name: info['title'],
    year: info['year'],
    actor: info['actor']
}
    if (info['title'].length < 1 ){
        res.status(412).json("Must have title");
    }
    if (info['year'].length < 1){
        res.status(412).json("Release year ???");
    }
    if (info['actor'].length == 3)
    {
      usergrid.POST(entity, function(error, usergridResponse, entity) {
      res.status(200).json("Movie added !");
      })
    }
    else
    {
      res.status(412).json("Must have 3 actors");
    }
}

function getOne (req, res, next){
  var name = req.swagger.params.title.value;
  usergrid.GET('movies', name , function(error, usergridResponse, entity) {
     if (usergridResponse.ok){
      res.status(200).json(usergridResponse.entities);
     }
     else{
      res.status(404).json("Can't find the movie title");
     }
  })
}

function update ( req,res,next){
  var key = false
  var title = req.swagger.params.title.value;
  var info = req.swagger.params.year.value;

  //Check for existance of movie
  usergrid.GET('movies', title , function(error, usergridResponse, entity) {
  if (usergridResponse.ok){
    //set up entites 
    var entity = {
      type: 'movies',
      name: title,
      year: info['year'],
      actor: info['actor']
    }
    usergrid.PUT(entity, function(error, usergridResponse, entity) {
      res.status(200).json("Movie updated !");
    })
  }
  else{
    res.status(404).json("Movie does not exist !");
  }  
  })
}

function delete_movie(req, res,next){
  var name = req.swagger.params.title.value;
  console.log(name)
  usergrid.DELETE('movies', name, function(error, usergridResponse) {
    if (usergridResponse.ok){
      res.status(200).json("Deleted");
     }
    else{
      res.status(404).json("Can't find the movie title");
    }
})
}

// function hello(req, res) {
//   // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
//   var name = req.swagger.params.name.value || 'stranger';
//   var hello = util.format('Hello, %s!', name);

//   // this sends back a JSON response which is a single string
//   res.json(hello);
// }
