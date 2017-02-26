
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
    res.json("You just call GET function. And no parameter");
}
function add(req, res,next){
    if (req.body){
    res.setHeader('Content-Type', 'application/json');
    res.json({success:1, description: "Successfully add new car", "saved info": req.body });
    } else {
        res.json({success:0, description:" FAil to request info"})
        res.status(204).send();
    }
}
function getOne(req, res, next) {
    if (id){
    var  id = req.swagger.params.id.value;
    res.json("The car id you entered is "+ id );
    } else {
        res.json({success:0, description:"ID was not in parameter"});
        res.status(204).send();
    }
}
function update(req, res, next) {
    if (req.body){
    res.setHeader('Content-Type', 'application/json');
    res.json({success:1, description: "Successfully update car's info", "saved info": req.body });
    } else {
        res.json({success:0, description:" FAil to request info"})
        res.status(204).send();
    }

}

function delCar(req, res, next) {
    if (id){
    var  id = req.swagger.params.id.value;
    res.json({success:1, description: "You just deleted car :" + id });
    } else {
        res.json({success:0, description:"ID was not in parameter"});
        res.status(204).send();
    }
}

