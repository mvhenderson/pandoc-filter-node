#!/usr/bin/env node

// same as caps test, but using updated JSON format
'use strict';

var pandoc = require('../../../index');
var Str = pandoc.Str;

function action({t: type, c: value},format,meta) {
	if (type === 'Str') return Str(value.toUpperCase());
}

pandoc.stdio(action);
