#!/usr/bin/env node

// https://github.com/jgm/pandocfilters/blob/master/examples/metavars.py
// NOTE: this python filter doesn't seem to work as expected
//       pandoc 1.12.3, python 2.7.5, OS X 10.9.2
//
// Pandoc filter to allow interpolation of metadata fields
// into a document.  %{fields} will be replaced by the field's
// value, assuming it is of the type MetaInlines or MetaString.
'use strict';

var pandoc = require('../../../index');
var Str = pandoc.Str;
var Span = pandoc.Span;
var attributes = pandoc.attributes;

function action(type,value,format,meta) {
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
