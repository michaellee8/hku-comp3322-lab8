var express = require('express');
var router = express.Router();

/*
* GET contactList.
*/
router.get('/contactList', function (req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  collection.find({}, {}, function (err, docs) {
    if (err === null) {
      res.json(docs);
    } else {
      res.send({msg: err});
    }
  });
});

/*
 * POST to addContact.
 */
router.post('/addContact', function (req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  collection.insert(req.body, function (err, result) {
    res.send(
        (err === null) ? {msg: ''} : {msg: err}
    );
  });
});

/*
* PUT to updateContact
*/
router.put('/updateContact/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  var contactToUpdate = req.params.id;
  delete req.body._id;

  collection.update({_id: contactToUpdate}, {$set: req.body},
      function (err, result) {
        if (err) {
          console.log(err);
        }
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
      })

});

router.delete("/deleteContact/:id", function (req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  var contactToUpdate = req.params.id;

  collection.remove({_id: contactToUpdate}, function (err, result) {
    if (err) {
      console.log(err);
    }
    res.send(
        (err === null) ? {msg: ''} : {msg: err}
    );
  })
});

module.exports = router;