'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
    date: Date,
    time: String,
    name: String,
    amount: Number,
    items: [{ type: Schema.ObjectId, ref: 'Order' }],
    item_count: Number,
    user: { type: Schema.ObjectId, ref: 'User' },
    active_status: { type: Boolean, default: true }
},
    {
        timestamps: true
    });


module.exports = mongoose.model('Order', OrderSchema);
