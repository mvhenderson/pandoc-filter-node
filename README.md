## About

Node.js/TypeScript port of the Python [pandocfilters][] for filtering with [Pandoc][]

## Install

```bash
npm install -g pandoc-filter
```

## Example

```javascript
#!/usr/bin/env node

// Pandoc filter to convert all text to uppercase

var pandoc = require("pandoc-filter");
var Str = pandoc.Str;

function action({ t: type, c: value }, format, meta) {
	if (type === "Str") return Str(value.toUpperCase());
}

pandoc.stdio(action);
```

Async using native promise

```javascript
#!/usr/bin/env node
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
```

## Compatibility Notes

Required node `>=v8` for async/await/promise support.

`v0.1.6` is required for pandoc versions after `1.17.2` to support the new JSON
format. See [this issue](https://github.com/mvhenderson/pandoc-filter-node/issues/5) for details.

## Credits

Thanks to [John MacFarlane](https://github.com/jgm) for Pandoc.

## License

MIT

[pandoc]: http://johnmacfarlane.net/pandoc
[pandocfilters]: https://github.com/jgm/pandocfilters
