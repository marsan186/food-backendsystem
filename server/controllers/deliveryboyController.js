'use strict';
var _ = require('lodash');
const DeliveryBoy = require('../models/deliveryBoyModel.js');

var validationError = function (res, err) {
    return res.json(422, err);
};

// Creates a new Delivery Boy



exports.createDeliveryBoy = function (req, res, next) {
    var newAdmin = new DeliveryBoy(req.body);
    newAdmin.username =req.body.user_name;
    newAdmin.password = newAdmin.generateHash(req.body.password);
    newAdmin.provider = 'local';
    newAdmin.role = 'delivery';
    newAdmin.save(function (err, rec) {
        if (err) return validationError(res, err);
        res.status(201).json(rec);
    });
};



// DeliveryBoy Login

exports.deliveryBoyLogin = function (req, res, next) {

    DeliveryBoy.findOne({ username: req.body.user_name }).then(loginUser => {
        if (!loginUser) {
            return res.status(401).json("Invalid user name and password");
        }

        if (!loginUser.validatePassword(req.body.password)) {
            return res.status(401).json("Invalid password");
        }

        // const withTokem ={...loginUser}
        const withTokem = { username: loginUser.username, _id: loginUser._id }
        withTokem.token = loginUser.generateJWT();
        res.status(200).json(withTokem);
    })

};

//Get list of DeliveryBoy
 
exports.getDeliveryBoyDetails = function (req, res) {
    DeliveryBoy.find({}, function (err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};

// get DeliveryBoy by Id

exports.findDeliveryBoyByUserId = function (req, res, next) {
    var userId = req.params.UserId;
    DeliveryBoy.findOne({
        "_id": userId
    }, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user);
    });
};

// delete Delivery Boy

exports.deleteDeliveryBoyByUserId = function (req, res) {
    DeliveryBoy.findByIdAndDelete(req.params.UserId, function (err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};

//update Delivery Boy details

exports.updateDeliveryBoyByUserId = function (req, res) {
    var UserId = req.params.UserId;
    DeliveryBoy.findOne({
        "_id": UserId
    },function (err, user) {
        if (err) { return handleError(res, err); }
        if (!user) { return res.send(404); }
        var updated = _.merge(user, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, user);
        });
    });
};
