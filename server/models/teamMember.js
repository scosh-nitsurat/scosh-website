const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var teamMemberSchema = new Schema({
    year: {
        type: String,
        require: true,
    },
    Member: [
        {
            image: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                require: true,
            },
            position: {
                type: String,
                require: true,
            },
            facebook: {
                type: String,
                default: "",
            },
            linkedin: {
                type: String,
                default: "",
            },
            gmail: {
                type: String,
                default: "",
            },
            instagram: {
                type: String,
                default: "",
            },
        },
    ],
});

module.exports = teamMemberSchema = mongoose.model(
    "teamMember",
    teamMemberSchema
);
