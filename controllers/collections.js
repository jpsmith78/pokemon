const express = require('express');
const router = express.Router();
const Collection = require('../models/collections.js');


router.get('/', (req,res) => {
  Collection.find({}, (err,foundCollection) => {
    res.json(foundCollection);
  })
})

router.post('/', (req,res) => {
  Collection.create(req.body, (err, createdCollection) => {
    res.json(createdCollection);
  })
})

router.delete('/:id', (req,res) => {
  Collection.findByIdAndRemove(req.params.id, (err,deletedCollection) => {
    res.json(deletedCollection);
  });
});

module.exports = router;
