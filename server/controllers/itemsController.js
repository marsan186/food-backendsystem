'use strict';

var _ = require('lodash');
const Item = require('../models/itemsModel.js');

var handleError = function handleError(res, err) {
    return res.send(500, err);
}

// Creates a new Item.
exports.createItems = function (req, res) {
    var newItem = new Item(req.body);
    newItem.save(function (err, item) {
        if (err) return validationError(res, err);
        res.json("Item added successfully");
        console.log(item);
    });
};
// Get list of Items
exports.getAllItems = function (req, res) {
    if (req.params.vendor_id != null) {
        Item.find({
            "belongs_To": req.params.vendor_id,
            "active_status": true
        }, function (err, items) {
            if (err) return next(err);
            if (!items) return res.send(401);
            console.log(items);
            res.json(items);
        });
    }
    else {
        res.json(400, 'no items available');
    }
};

// Get list of Items -getSnacks
exports.getSnacksItems = function (req, res) {
    Item.find({ "isSnack": true, "belongs_To": req.params.vendor_id, "active_status": true }, function (err, items) {
        if (err) { return handleError(res, err); }
        return res.json(200, items);
    });
};

// Get list of Items - getDishes
exports.getDishesItems = function (req, res) {
    Item.find({ "isSnack": false, "belongs_To": req.params.vendor_id, "active_status": true }, function (err, items) {
        if (err) { return handleError(res, err); }
        return res.json(200, items);
    });
};


// Get a single Item
exports.getItemById = function (req, res) {
    if (req.params.vendor_id != null) {
        Item.findOne({
            "belongs_To": req.params.vendor_id,
            "item_id": req.params.item_id,
            "active_status": true
        }, function (err, item) {
            if (err) return next(err);
            if (!item) return res.send(401);
            console.log(item);
            res.json(item);
        });
    }
    else {
        res.json(400, 'no items available');
    }
};




// Updates an existing Item.
exports.updateItemById = function (req, res) {
    if (req.params.vendor_id != null) {
        Item.findOne({
            "belongs_To": req.params.vendor_id,
            "item_id": req.params.item_id
        }, function (err, item) {
            if (err) { return handleError(res, err); }
            if (!item) { return res.send(404); }
            var updated = _.merge(item, req.body);
            updated.save(function (err) {
                if (err) { return handleError(res, err); }
                return res.json('updated successfully');
            });
        });
    }
    else {
        res.json(400, 'no items available');
    }
};

// Deletes an Item.
exports.deleteItemById = function (req, res) {
    if (req.params.vendor_id != null) {
        Item.findOne({
            "belongs_To": req.params.vendor_id,
            "item_id": req.params.item_id
        }, function (err, item) {
            if (err) { return handleError(res, err); }
            if (!item) { return res.send(404); }
            item.active_status = false;
            item.save(function (err) {
                if (err) { return handleError(res, err); }
                return res.json('deleted successfully');
            });
        });
    }
    else {
        res.json(400, 'no items available');
    }
};

exports.deleteItemsById = function (req, res) {
    if (req.params.vendor_id != null) {
        Item.findOne({
            "belongs_To": req.params.vendor_id,
            "item_id": req.params.item_id
        }, function (err, item) {
            if (err) { return handleError(res, err); }
            if (!item) { return res.send(404); }
            item.active_status = false;
            item.save(function (err) {
                if (err) { return handleError(res, err); }
                return res.json('deleted successfully');
            });
        });
    }
    else {
        res.json(400, 'no items available');
    }
};


