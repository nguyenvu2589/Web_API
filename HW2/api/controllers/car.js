
'use strict';
// Include our "db"

// Exports all the functions to perform on the db
module.exports = {
    getAll : getAll,
    add : add,
    getOne : getOne,
    update : update,
    delCar : delCar
};
// GET /car
function getAll(req, res, next) {
    res.json("You just call GET function");
}
function add(req, res,next){
    res.setHeader('Content-Type', 'application/json');
    res.json({success:1, description: "Successfully add new car", "saved info": req.body });
    
}
function getOne(req, res, next) {
    var  id = req.swagger.params.id.value;
    res.json("The car id you entered is "+ id );
    
}
function update(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.json({success:1, description: "Successfully update car's info", "saved info": req.body });
    

}

function delCar(req, res, next) {
    var  id = req.swagger.params.id.value;
    res.json({success:1, description: "You just deleted car :" + id });
    
}

