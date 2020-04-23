#!/usr/bin/env node

// same as metavars test but using new json format
'use strict';

var pandoc = require('../../../index');
var Str = pandoc.Str;
var Span = pandoc.Span;
var attributes = pandoc.attributes;

function action({t: type, c: value},format,meta) {
	if (type === 'Str') {
		var m = value.match(/%\{(.*)\}$/);
		if (m) {
			var field = m[1];
			var result = meta[field] || {};
			if (result.t === 'MetaInlines') {
				return Span(
					attributes({
						'class': 'interpolated',
						'field': field
					}),
					result.c);
			}
			else if (result.t === 'MetaString') {
				return Str(result.c);
			}
		}
	}
}

pandoc.stdio(action);
