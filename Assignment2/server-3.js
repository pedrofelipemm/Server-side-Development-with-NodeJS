var mongoose = require('mongoose'),
    assert = require('assert');

var Leaders = require('./models/leadership');

var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected correctly to server");

    Leaders.create({
      "name": "Peter Pan",
      "image": "images/alberto.png",
      "designation": "Chief Epicurious Officer",
      "abbr": "CEO",
      "description": "Our CEO, Peter, . . ."
}, function (err, leader) {
        if (err) throw err;
        console.log('leader created!');
        console.log(leader);

        var id = leader._id;

        setTimeout(function () {
            Leaders.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log('Updated leader!');
                    console.log(leader);
                    db.collection('leader').drop(function () {
                        db.close();
                    });
                });
        }, 3000);
    });
});