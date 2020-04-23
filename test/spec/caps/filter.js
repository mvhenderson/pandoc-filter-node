#!/usr/bin/env node

// https://github.com/jgm/pandocfilters/blob/master/examples/caps.py
//
// Pandoc filter to convert all text to uppercase
'use strict';

var pandoc = require('../../../index');
var Str = pandoc.Str;

function action({t: type, c: value},format,meta) {
	if (type === 'Str') return Str(value.toUpperCase());
}

pandoc.stdio(action);
