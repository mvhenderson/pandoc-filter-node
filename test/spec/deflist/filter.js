#!/usr/bin/env node

// https://github.com/jgm/pandocfilters/blob/master/examples/deflists.py
//
// Pandoc filter to convert definition lists to bullet
// lists with the defined terms in strong emphasis (for
// compatibility with standard markdown).
'use strict';

var pandoc = require('../../../index');
var BulletList = pandoc.BulletList;
var Para = pandoc.Para;
var Strong = pandoc.Strong;

function action({t: type, c: value}, format, meta) {
	if (type === 'DefinitionList') {
		var bullets = [];
		value.forEach(function (v) {
			var term = v[0];
			var defs = v[1];

			var bullet = [ Para([ Strong(term) ]) ];
			defs.forEach(function (d) {
				d.forEach(function (b) {
					bullet.push(b);
				});
			});
			bullets.push(bullet);
		});
		return BulletList(bullets);
	}
}

pandoc.stdio(action);
