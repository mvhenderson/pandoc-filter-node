#!/usr/bin/env node

// https://github.com/jgm/pandocfilters/blob/master/examples/deemph.py
//
// Pandoc filter that causes emphasized text to be displayed
// in ALL CAPS.
'use strict';

var pandoc = require('../../../index');

function caps({t: type, c: value},format,meta) {
	if (type === 'Str') return pandoc.Str(value.toUpperCase());
}

function action({t: type, c: value},format,meta) {
	if (type === 'Emph') {
		return pandoc.walk(value,caps,format,meta);
	}
}

pandoc.stdio(action);
