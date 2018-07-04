#!/usr/bin/env node

// async test
'use strict';

var pandoc = require('../../../index');
var rp = require('request-promise-native');
var Str = pandoc.Str;

async function action(type,value,format,meta) {
	if (type === 'Str') return rp({
		uri: value,
		json: true
	}).then(function (data) {
		return Str(data.places[0]["post code"]);
	})
}

pandoc.stdioAsync(action);
