var axios = require('axios');
var Character = require('../models/Character');
var constants = require('../constants');

function seedDataIfNotExists() {
    Character.find({}, (error, results) => {
        if (!results.length) {
            let data;
            axios.get(constants.CHARACTER_URL).then(result => {
                if (result.status === 200) {
                    data = result.data.results;
                    return Character.insertMany(data);
                }
            });
        } else if (error) {
            res.send().json(error);
        } else {
            console.log(constants.DATA_ALREADY_INSERTED);
        }
    })
}

module.exports = seedDataIfNotExists