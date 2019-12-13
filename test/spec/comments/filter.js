#!/usr/bin/env node

// https://github.com/jgm/pandocfilters/blob/master/examples/comments.py
//
// Pandoc filter that causes everything between
// '<!-- BEGIN COMMENT -->' and '<!-- END COMMENT -->'
// to be ignored.  The comment lines must appear on
// lines by themselves, with blank lines surrounding
// them.
'use strict';

var pandoc = require('../../../index');

var incomment = false;

function action({t: type, c: value},format,meta) {
	if (type === 'RawBlock') {
		if (value[0] === 'html') {
			if (value[1].indexOf('<!-- BEGIN COMMENT -->') !== -1) {
				incomment = true;
				return [];
			}
			else if (value[1].indexOf('<!-- END COMMENT -->') !== -1) {
				incomment = false;
				return [];
			}
		}
	}
	if (incomment) return [];
}

pandoc.stdio(action);
