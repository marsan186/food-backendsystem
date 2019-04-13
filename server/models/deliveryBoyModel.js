'use strict';

const mongoose = require('mongoose');
const bcrpt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const config = require("../../config/database.config");

const DeliveryBoy = new mongoose.Schema({
    name: String,
	 password: { type: String, required: true },
	 username: { type: String, required: true, unique: true },
    email_address: { type: String, lowercase: true },
    contact_number: String,
    vehicle_number: String,
    driving_license_no:String,
    role: {
        type: String,
        default: 'delivery'
    },
    audit_user: String,
    active_status: Boolean,
}, {
        timestamps: true
    });

	
	
DeliveryBoy.methods.generateHash = function (password) {
    return bcrpt.hashSync(password, bcrpt.genSaltSync(8), null);
}
DeliveryBoy.methods.validatePassword = function (password) {
    return bcrpt.compareSync(password, this.password);
}

DeliveryBoy.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign({
        username:this.username,
        id:this._id,
        exp:parseInt(expirationDate.getTime()/1000,10),
    },config.secret)
}

DeliveryBoy.plugin(uniqueValidator);

module.exports = mongoose.model('DeliveryBoy', DeliveryBoy);