var express = require('express')
var app = express()
var http = require('http')
var https = require('https')

//
// Variables to convert.
//
var base_url = 'https://unosatgis.cern.ch/arcgis/rest/services/FP02/'
var service_id = 'FP02_FL_20130822_PAK_20070707_PreFlood_SPOT5'

var objectId = {}

//
// Getting a summary.
//
app.get('/count', function (req, res) {
  if (req.query.url) {
    service_url += '/' + req.query.url
  }
  var query_extension = '/query?where=1=1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&f=json'
  console.log(service_url + query_extension)
  https.get(service_url + query_extension, function (response) {
    response.on('data', function (chunk) {
      res.write(chunk)
    })
    response.on('close', function (data) {
      res.end()
    })
    response.on('end', function (data) {
      res.end()
    })
  }).on('error', function () {
    res.send({ 'succes': false, 'message': 'Could not connect to ArcGIS instance.'})
  })
})

//
// Collect layer information
// from an ArcGIS service.
//
app.get('/layers', function (req, res) {
  var service_id = req.query.service_id
  var service_url = base_url + service_id + '/MapServer'
  https.get(service_url + '/layers?f=json', function (response) {
    console.log(service_url + '/layers?f=json')
    var body = ''
    response.on('data', function (chunk) {
      body += chunk
    })
    response.on('end', function () {
      var parsed_body = JSON.parse(body)
      var out = {
        'service': service_url,
        'count': parsed_body.layers.length,
        'layers': []
      }
      for (i = 0; i < out.count; i++) {
        var layer = parsed_body.layers[i]
        var layer_info = { 'id': layer.id,  'name': layer.name }
        out.layers.push(layer_info)
      }
      http.get('/count?id=' + layer_info.id, function (resp) {
        var body = ''
        resp.on('data', function (chunk) {
          body += chunk
        })
        resp.on('end', function () {
          out.layers[0].count = body.count
          res.send(out)
        })
      })
    })
    response.on('close', function (data) {
      res.send(body)
    })
  }).on('error', function () {
    res.send({ 'succes': false, 'message': 'Could not connect to ArcGIS instance.'})
  })
})

//
// Starting the server.
//
var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
