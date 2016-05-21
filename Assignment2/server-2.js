var mongoose = require('mongoose'),
    assert = require('assert');

var Promotions = require('./models/promotions');

var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected correctly to server");

    Promotions.create( {
      "name": "Weekend Grand Buffet",
      "image": "images/buffet.png",
      "label": "New",
      "price": "19.99",
      "description": "Featuring . . ."
}, function (err, promotion) {
        if (err) throw err;
        console.log('promotion created!');
        console.log(promotion);

        var id = promotion._id;

        setTimeout(function () {
            Promotions.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, promotions) {
                    if (err) throw err;
                    console.log('Updated promotions!');
                    console.log(promotions);
                    db.collection('promotions').drop(function () {
                        db.close();
                    });
                });
        }, 3000);
    });
});