/* global describe,it */
'use strict';

var exec   = require('child_process').exec;
var fs     = require('fs');
var path   = require('path');
require('should');

// run the filter, simulating `pandoc source.md -t json | filter`
function run(spec, format, cb) {
	var dir = path.resolve('test', 'spec', spec);
	var cmd = 'node ' + path.resolve(dir, 'filter.js');
	if (format) cmd += ' ' + format;

	var child = exec(cmd, function (error, stdout, stderr) {
		if (error) return cb(error);
		var expected = require(path.resolve(dir, 'expected.json'));
		var actual = JSON.parse(stdout);
		cb(null,expected,actual);
	});

	var infile = path.resolve(dir,'input.json');
	fs.createReadStream(infile, {encoding: 'utf8'}).pipe(child.stdin);
}

describe('Filter', function () {
	it('caps', function (done) {
		run('caps', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('deflist', function (done) {
		run('deflist', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('comments', function (done) {
		run('comments', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('deemph', function (done) {
		run('deemph', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('metavars', function (done) {
		run('metavars', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('caps - new JSON', function (done) {
		run('newcaps', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('meta - new JSON', function (done) {
		run('newmeta', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it('async - native promise', function (done) {
		run('async', '', function (error,expected,actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});

});
