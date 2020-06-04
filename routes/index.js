var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
var Character = require('../models/Character');
var constants = require('../constants');
var Users = require('../models/Users');

// User REgistration
router.post('/register', function (req, res) {
    try {
        var query = {
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            sorting: ''
        };

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(query.password, salt, (err, hash) => {
                if(err) throw err;
        
                // Set the hashed password and save the model
                query.password = hash;
                
                Users.create(query, (err, result) => {
                    if (err) {
                        res.status(401).json({ error: constants.USER_ALREADY_EXISTS });
                    }        
                    res.status(200).json(result);
                })               
            })
         });
    } catch (error) {
        res.status(500).json({ error: constants.INTERNAL_SERVER_ERROR });
    }

});

// Character Filter
router.post('/filters', function (req, res) {
    try {
        const data = {
            sortOption: req.body.sorting,
            searchName: req.body.searchName,
            filters: {
                species: req.body.filters.species,
                gender: req.body.filters.gender,
                origin: req.body.filters.origin
            }
        };
        const filter = {};
        let aggregatePipeline = [];

        // name search
        if (data.searchName) {
            filter.name = new RegExp(`^.*${data.searchName.trim()}.*$`, 'i');
        }

        // gender filter
        if (data.filters.gender.length) {
            filter.gender = { $in: data.filters.gender };
        }

        // species filter
        if (data.filters.species.length) {
            filter.species = { $in: data.filters.species };
        }

        // origin filter
        if (data.filters.origin.length) {
            filter['origin.name'] = { $in: data.filters.origin };
        }

        // filter added to pipeline
        aggregatePipeline.push({ $match: filter });

        // sorting
        if (data.sortOption) {
            aggregatePipeline.push({ $sort: { id: (data.sortOption.trim().toLowerCase() === 'asc') ? 1 : -1 } });
        }

        const aggregation = Character.aggregate(aggregatePipeline);
        var searchResults = aggregation.exec();
        return searchResults.then((data) => {
            return res.status(200).json(data);

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: constants.INTERNAL_SERVER_ERROR });
    }
});

// user login
router.post('/login', function (req, res) {
    try {
        var userQuery = {
            username: req.body.username,
            password: req.body.password
        };

        Users.findOne({username:userQuery.username}, function (err, result) {

            if(result){
                bcrypt.compare(userQuery.password, result.password, function(errors, response) {
                    if(response){
                        res.status(200).json(result);
                    }else{
                        res.status(401).json({ error: 'Wrong Password' }); 
                    }
                })
            }
            if (err) {
                res.status(500).json({ error: constants.INTERNAL_SERVER_ERROR  });
            }
            if (result === null) {
                res.status(401).json({ error: constants.UNAUTHORIZED_USER });
            } 
        })
    } catch (error) {
        res.status(500).json({ error: constants.INTERNAL_SERVER_ERROR});
    }
});

// save sorting 
router.post('/updatesort', function (req, res) {
    try {
        const findUser = {
            username: req.body.username
        }
        const updateSorting = {
            sorting: req.body.sorting
        }
        Users.updateOne(findUser, {$set:updateSorting}, function(error, result){
            if(error){
                res.status(500).json({ error: 'Error while updating filter'});
            }
            res.status(200).json(result);
        });
    } catch (error) {
        res.status(500).json({ error: constants.INTERNAL_SERVER_ERROR});
    }
})

module.exports = router;