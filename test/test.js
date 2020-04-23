/* global describe,it */
"use strict";

var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");
require("should");

// run the filter, simulating `pandoc source.md -t json | filter`
function run(spec, format, cb) {
	var dir = path.resolve("test", "spec", spec);
	var cmd = "node " + path.resolve(dir, "filter.js");
	if (format) cmd += " " + format;

	var child = exec(cmd, function (error, stdout, stderr) {
		if (error) return cb(error);
		var expected = require(path.resolve(dir, "expected.json"));
		var actual = JSON.parse(stdout);
		cb(null, expected, actual);
	});

	var infile = path.resolve(dir, "input.json");
	fs.createReadStream(infile, { encoding: "utf8" }).pipe(child.stdin);
}

describe("Filter", function () {
	it("caps", function (done) {
		run("caps", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("deflist", function (done) {
		run("deflist", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("comments", function (done) {
		run("comments", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("deemph", function (done) {
		run("deemph", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("metavars", function (done) {
		run("metavars", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("caps - new JSON", function (done) {
		run("newcaps", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("meta - new JSON", function (done) {
		run("newmeta", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
	it("async - native promise", function (done) {
		run("async", "", function (error, expected, actual) {
			if (error) done(error);
			actual.should.eql(expected);
			done();
		});
	});
});

describe("Utility", function () {
	// maybe externalize these json documents?
	it("can stringify pandoc ast", () => {
		const { stringify } = require("..");
		const input = {
			blocks: [
				{
					t: "Header",
					c: [1, ["hello", [], []], [{ t: "Str", c: "Hello" }]],
				},
				{
					t: "Para",
					c: [
						{ t: "Str", c: "This" },
						{ t: "Space" },
						{ t: "Str", c: "is" },
						{ t: "Space" },
						{ t: "Str", c: "a" },
						{ t: "Space" },
						{ t: "Str", c: "test." },
					],
				},
			],
			"pandoc-api-version": [1, 20],
			meta: {},
		};
		stringify(input).should.eql("Hello\nThis is a test.");
	});

	const egMetaRaw = {
		receipt: "Oz-Ware Purchase Invoice",
		specialDelivery: "\nFollow the Yellow Brick Road to the Emerald City.",
		items: [
			{
				descrip: "Water Bucket (Filled)",
				price: "1.47",
			},
			{
				descrip: "High Heeled Ruby Slippers",
				price: "133.7",
			},
		],
		date: "2012-08-06",
		customer: { first_name: "Dorothy", family_name: "Gale" },
	};

	// what pandoc returns when you put the above in the front matter
	const egMetaAst = {
		receipt: {
			t: "MetaInlines",
			c: [
				{ t: "Str", c: "Oz-Ware" },
				{ t: "Space" },
				{ t: "Str", c: "Purchase" },
				{ t: "Space" },
				{ t: "Str", c: "Invoice" },
			],
		},
		specialDelivery: {
			t: "MetaBlocks",
			c: [
				{
					t: "Para",
					c: [
						{ t: "Str", c: "Follow" },
						{ t: "Space" },
						{ t: "Str", c: "the" },
						{ t: "Space" },
						{ t: "Str", c: "Yellow" },
						{ t: "Space" },
						{ t: "Str", c: "Brick" },
						{ t: "Space" },
						{ t: "Str", c: "Road" },
						{ t: "Space" },
						{ t: "Str", c: "to" },
						{ t: "Space" },
						{ t: "Str", c: "the" },
						{ t: "Space" },
						{ t: "Str", c: "Emerald" },
						{ t: "Space" },
						{ t: "Str", c: "City." },
					],
				},
			],
		},
		items: {
			t: "MetaList",
			c: [
				{
					t: "MetaMap",
					c: {
						descrip: {
							t: "MetaInlines",
							c: [
								{ t: "Str", c: "Water" },
								{ t: "Space" },
								{ t: "Str", c: "Bucket" },
								{ t: "Space" },
								{ t: "Str", c: "(Filled)" },
							],
						},
						price: {
							t: "MetaInlines",
							c: [{ t: "Str", c: "1.47" }],
						},
					},
				},
				{
					t: "MetaMap",
					c: {
						descrip: {
							t: "MetaInlines",
							c: [
								{ t: "Str", c: "High" },
								{ t: "Space" },
								{ t: "Str", c: "Heeled" },
								{ t: "Space" },
								{
									t: "Quoted",
									c: [
										{ t: "DoubleQuote" },
										[{ t: "Str", c: "Ruby" }],
									],
								},
								{ t: "Space" },
								{ t: "Str", c: "Slippers" },
							],
						},
						price: {
							t: "MetaInlines",
							c: [{ t: "Str", c: "133.7" }],
						},
					},
				},
			],
		},
		date: { t: "MetaInlines", c: [{ t: "Str", c: "2012-08-06" }] },
		customer: {
			t: "MetaMap",
			c: {
				first_name: {
					t: "MetaInlines",
					c: [{ t: "Str", c: "Dorothy" }],
				},
				family_name: {
					t: "MetaInlines",
					c: [{ t: "Str", c: "Gale" }],
				},
			},
		},
	};

	// it's different than egMetaRaw because inlines/blocks are returned as MetaString (which is fine)
	const egMetaRawToAst = {
		receipt: { t: "MetaString", c: "Oz-Ware Purchase Invoice" },
		specialDelivery: {
			t: "MetaString",
			c: "\nFollow the Yellow Brick Road to the Emerald City.",
		},
		items: {
			t: "MetaList",
			c: [
				{
					t: "MetaMap",
					c: {
						descrip: {
							t: "MetaString",
							c: "Water Bucket (Filled)",
						},
						price: { t: "MetaString", c: "1.47" },
					},
				},
				{
					t: "MetaMap",
					c: {
						descrip: {
							t: "MetaString",
							c: "High Heeled Ruby Slippers",
						},
						price: { t: "MetaString", c: "133.7" },
					},
				},
			],
		},
		date: { t: "MetaString", c: "2012-08-06" },
		customer: {
			t: "MetaMap",
			c: {
				first_name: { t: "MetaString", c: "Dorothy" },
				family_name: { t: "MetaString", c: "Gale" },
			},
		},
	};
	it("can convert pandoc meta ast to json", () => {
		const { metaMapToRaw } = require("..");
		metaMapToRaw(egMetaAst).should.eql(egMetaRaw);
	});
	it("can convert json to pandoc meta ast", () => {
		const { rawToMeta } = require("..");
		rawToMeta(egMetaRaw).should.eql({ t: "MetaMap", c: egMetaRawToAst });
	});
});
