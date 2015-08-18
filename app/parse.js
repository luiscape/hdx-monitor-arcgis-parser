var fs = require('fs')
var Terraformer = require('terraformer-arcgis-parser')
var obj = JSON.parse(fs.readFileSync('../data/test.json', 'utf8')).feature
var r = Terraformer.parse(obj)

console.log(r)
