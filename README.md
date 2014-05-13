## About

Node.js port of the Python [pandocfilters][] for filtering with [Pandoc][]

## Install

```bash
npm install -g pandoc-filter
```

## Example

```javascript
#!/usr/bin/env node

// Pandoc filter to convert all text to uppercase

var pandoc = require('pandoc-filter');
var Str = pandoc.Str;

function action(type,value,format,meta) {
	if (type === 'Str') return Str(value.toUpperCase());
}

pandoc.stdio(action);
```

## Credits

Thanks to [John MacFarlane](https://github.com/jgm) for Pandoc.

## License

MIT


[Pandoc]: http://johnmacfarlane.net/pandoc
[pandocfilters]: https://github.com/jgm/pandocfilters
