var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var leaderSchema = new Schema({
    name: {type: String, required: true, unique: true},
    image: {type: String, required: true, unique: true},
    designation: {type: String, required: true, unique: false},
    abbr: {type: String, required: true, unique: false},
    description: {type: String, required: true}
}, {
    timestamps: true
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;