var mongojs = require('mongojs');
var connectionString = 'mongodb://localhost/mycart';
conn = mongojs(connectionString, [], { authMechanism: 'ScramSHA1' });

exports.conn = conn;

/*
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/project5');

console.log(mongoose.Schema);*/