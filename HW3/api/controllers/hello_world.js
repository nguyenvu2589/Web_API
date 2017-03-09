'use strict';

var util = require('util');


function print (req , res){
  var a = getgit(req,res);

  res.end(a);
}
function getgit(req, res) {


  var GitHubApi = require('github');
  var git = new GitHubApi({
    version: "3.0.0"
  });
  var token = "GITHUB KEY";

  git.authenticate({
    type:"oauth",
    token : token
  });

  var output = ""
  git.repos.getForUser({username: "nguyenvu2589"} ,function(err, data){
    //res.json(data.data[0]['owner'])
    res.json(data);
  })
  
}  

// function createVault(){
//   var vault = require('avault').createVault(__dirname);
//   var key ="key1";
//   vault.generateKey(key).then(
//     function(keyResponse){
//       vault.store(key,{"username": "git", "password": "123"},
//       function (storeResponse){
//         console.log("success" , storeResponse);
//       },
//     function (err){
//       console.log("Error", err);
//     });
// })
// }  

// function getKey(){
//   var vault = require('avault').createVault(__dirname);
//   vault.get('git',function(profile) {
//     var profile1 = JSON.parse(profile);
//     console.log(profile);
//   })
// }

module.exports = {
  hello: hello,
  getgit: getgit,
  print : print
};

function hello(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var name = "me"
  var hello = util.format('Hello, %s!', name);

  // this sends back a JSON response which is a single string
  res.json(hello);
}


