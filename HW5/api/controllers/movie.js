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
var usergrid = require('usergrid');
var config = require('./config');
//var UsergridQuery = require('usergridquery')
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

// var UsergridClient = require('../../node_modules/usergrid/lib/client')
// var client = new UsergridClient(config)

// DO NOT USE !!!!

usergrid.setAppAuth('b3U6fmmHJgxjEeeUYxIuBzeXfQ', 'b3U6BLnQe6NwhHmMOEIxwMqrLipzMsY')
usergrid.authenticateApp(function(error, usergridResponse, token) {
  if (usergridResponse.ok){
      console.log("connected!")
  }
  else
  {
    console.log("FAil to connect !!!")
  }
})

module.exports = {
  getAll : getAll,
  save   : save,
  getOne : getOne,
  update : update,
  delete_movie: delete_movie,
};

function getAll(req, res, next){
  var bool = req.query.review;
  var i=0;
  var response;
  var result;
  var count = 1 ;

  usergrid.GET('movies', function(error, usergridResponse, entities) {
    // print out to console to test.
    //console.log(usergridResponse.entities);
    if (usergridResponse.ok){
      var movie = usergridResponse.entities

      //review == true
      if (bool){
        
        usergrid.GET('reviews', function(error, usergridResponse, entities) {
          if (usergridResponse.ok){
            var review = usergridResponse.entities
            for (i ; i < movie.length; i ++){
              for (var j = 0; j < review.length; j++){
                if (movie[i].name === review[j].title){
                  if (movie[i].review !== null){
                    
                    movie[i]["review "+ count] = (review[j])
                    count++;
                  }
                }
                
              }
              count =1;
            }
            res.status(200).json(movie);
          }
        })
      }
      else{
        res.status(200).json(movie);
      }
      
    }
    else{
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
  
  // FIND a way to get bool value 
  var bool = req.query.review;
  var review; 
  var movie;

  
// #######################################
// #######################################
// #######################################
  usergrid.GET('movies',name , function(error, usergridResponse, entity) {
    var view;
     if (usergridResponse.ok){
        movie = (usergridResponse.entities)
        if ( movie[0].view >0){
          movie[0].view +=1
        }
        else{
          movie[0].view =1
        }
        console.log(movie[0].view)
        var entity = {
          type: 'movies',
          name: movie[0].name,
          year: movie[0].year,
          actor: movie[0].actor,
          view: movie[0].view
        }   
        usergrid.PUT('movies', entity, function(error, usergridResponse, entity) {
          console.log (" added!")
        })
        // ################ ######################
        // ###########  GET REVIEW ###############
        // #######################################
        if (bool)
        {
          var query = "select * where title contains '" + name +"'"
          // pack in an option. 
          var options = {
            type:"reviews",
            qs:{ql: query }
          }

          usergrid.GET(options , function(error, usergridResponse, entity) {
             if (usergridResponse.ok){
                review = (usergridResponse.entities)
                movie[0].review = (review)
                res.status(200).json(movie);
             }
             else{
              return json("No reviews");
             }
          })
        }
        else{ 
          res.status(200).json(movie)
        }
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
