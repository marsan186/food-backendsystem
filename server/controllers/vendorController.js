'use strict';

const jwt = require('jsonwebtoken');
var _ = require('lodash');
var mongoose = require('mongoose');
const Vendor = require('../models/vendorModel.js');
const mailcontroller = require('./mailController');
const smscontroller = require('./smsController');
const imagecopitercontroller = require('./imageCopierController');
var base64ToImage = require('base64-to-image');
var fs = require('fs-extra')

var validationError = function (res, err) {
    return res.json(422, err);
};

var handleError = function handleError(res, err) {
    return res.send(500, err);
}
// Creates a new vendor

exports.createVendor = function (req, res, next) {
    //console.log('vendor-ctrl');
   // console.log(req.body);
    var newVendor = new Vendor(req.body);
    Vendor.findOne({
        "user_name": newVendor.user_name
    }, function (err, vendor) {
        if (err) return next(err);
        if (vendor) return res.send(401, { msg: "vendor already exist!!!" });
        else {
            newVendor.role = 'vendor';
            newVendor.save(function (err, vendor) {
                if (err) return validationError(res, err);
                res.status(200).json(vendor);
            });
            mailcontroller.sendMailtoUser(newVendor);
          //  smscontroller.sendSmstoUser();
        }
    });
};

//vendor login
exports.loginVendor = function (req, res, next) {
    var username = req.body.data.user_name;
    var password = req.body.data.password;
   
    Vendor.findOne({
        "user_name": username,
        "password": password,
        "active_status": true
    }, function (err, vendor) {
        if (err) return next(err);
        if (!vendor) return res.send(401);
        else {
            var token = jwt.sign({ user_name: vendor.user_name }, 'vendor-shared-secret', { expiresIn: '1h' });
            /*  var response = {user_name: username};
             response.token=token;*/
            var vendorresponse = { user_name: vendor.user_name, vendor_id: vendor._id };
            res.send(200, { vendorresponse, token: token });
            //  res.json(vendor);
        }
    });
};

//Get list of vendors

exports.getVendorsDetails = function (req, res) {
    Vendor.find({
       // "active_status": true
    }, function (err, vendors) {
        if (err) return res.send(500, err);
        res.json(200, vendors);
    });
};

// get vendor by Id
/* 
exports.findVendorByVendorId = function (req, res, next) {
    var RestaruntId = req.params.RestaruntId;
    Vendor.findOne({
        "RestaruntId": RestaruntId
    }, function (err, vendor) {
        if (err) return next(err);
        if (!vendor) return res.send(401);
        res.json(vendor);
    });
}; */
// get vendor by user name
exports.findVendorByVendorUsername = function (req, res, next) {
    var user_name = req.params.user_name;
  // console.log(user_name);
    Vendor.findOne({
        "user_name": user_name,
       // "active_status": true
    }, function (err, vendor) {
        if (err) return next(err);
        if (!vendor) return res.send(401);
       // console.log(vendor);
       res.status(200).json(vendor);
    });
};

// delete vendor

exports.deletevendorDetailsByvendorId = function (req, res) {
    Vendor.findByIdAndDelete(req.params.vendor_id, function (err, result) {
        if (err) { return handleError(res, err); }
        return res.json(200, { message: "Vendor successfully deleted!", result });
    });
};

//update vendor details

/* exports.updateVendorByVendorId = function (req, res) {
    var RestaruntId = req.params.RestaruntId;
    Vendor.findOne({
        "RestaruntId": RestaruntId
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) { return res.send(404); }
        var updated = _.merge(vendor, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, vendor);
        });
    });
};
 */ 


exports.updateVendorByVendorUsername = function (req, res) {
    var user_name = req.params.user_name;
    Vendor.findOne({
        "user_name": user_name,
      //  "active_status": true
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) { return res.send(404); }
        if (req.body.restarunt_image != null) {
            var file = req.body.restarunt_image;
            try {
                var imagedata = { 'user_name': user_name, 'file': file };
                req.body.restarunt_image = imagecopitercontroller.uploadImage(imagedata);
            }
            catch (ex) {
                console.log("Error :\n" + ex);
            }
        }
        var updated = _.merge(vendor, req.body);
        updated.save(function (err,rec) {
            if (err) { return handleError(res, err); }
            return res.status(200).json({success:false,result:rec,msg:"updated successfully"});
        });
    });
};

exports.activateVendor = function (req, res) {
    var user_name = req.params.user_name;
    Vendor.findOne({
        "user_name": user_name,
        "active_status": false
    }, function (err, vendor) {
        if (err) { return handleError(res, err); }
        if (!vendor) { return res.send(404); }
        vendor.active_status = true;
        vendor.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json('Activated successfully');
        });
    });
};

exports.getusername = function (username) {
    var user_name = username;
}