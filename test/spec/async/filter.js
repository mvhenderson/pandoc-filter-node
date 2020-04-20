#!/usr/bin/env node

// async test
"use strict";

var pandoc = require("../../../index");
var rp = require("request-promise-native");
var Str = pandoc.Str;

async function action({ t: type, c: value }, format, meta) {
	if (type === "Str") {
		const data = await rp({
			uri: value,
			json: true,
		});
		return Str(data.places[0]["post code"]);
	}
}

pandoc.stdio(action);
