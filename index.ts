/*! pandoc-filter-node | (C) 2014 Mike Henderson <mvhenderson@tds.net> | License: MIT */
/**
 * Javascript port of https://github.com/jgm/pandocfilters
 */
"use strict";

import getStdin from "get-stdin";

/**
 * type of the JSON file (new syntax, old syntax was just the array of blocks)
 */
export type PandocJson = {
	blocks: Block[];
	"pandoc-api-version": number[];
	meta: PandocMetaMap;
};
type FAReturn = void | AnyElt | Array<AnyElt>;

export type SingleFilterActionAsync = (
	ele: AnyElt,
	format: string,
	meta: PandocMetaMap,
) => Promise<FAReturn> | FAReturn;
export type ArrayFilterActionAsync = (
	ele: AnyElt[],
	format: string,
	meta: PandocMetaMap,
) => Promise<Array<AnyElt>> | Array<AnyElt>;

/**
 * allow both a function that filters single elements (compat with old version), as well as passing two filter functions:
 * one that will be called with every list of children and can return a new list of children to replace them,
 * and one that acts on single elements
 */
export type FilterActionAsync =
	| SingleFilterActionAsync
	| { array?: ArrayFilterActionAsync; single?: SingleFilterActionAsync };

/** list of key-value attributes */
export type AttrList = Array<[string, string]>;

/** [id, classes, list of key-value attributes] */
export type Attr = [string, Array<string>, AttrList];

export type MathType = { t: "DisplayMath" | "InlineMath" };
export type QuoteType = { t: "SingleQuote" | "DoubleQuote" };

/** [url, title] */
export type Target = [string, string];
/** output file format */
export type Format = string;

export type CitationMode = {
	t: "AuthorInText" | "SuppressAuthor" | "NormalCitation";
};

export type Citation = {
	citationId: string;
	citationPrefix: Array<Inline>;
	citationSuffix: Array<Inline>;
	citationMode: CitationMode;
	citationNoteNum: number;
	citationHash: number;
};

export type ListNumberStyle = {
	t:
		| "DefaultStyle"
		| "Example"
		| "Decimal"
		| "LowerRoman"
		| "UpperRoman"
		| "LowerAlpha"
		| "UpperAlpha";
};

export type ListNumberDelim = {
	t: "DefaultDelim" | "Period" | "OneParen" | "TwoParens";
};

export type ListAttributes = [number, ListNumberStyle, ListNumberDelim];

export type Alignment = {
	t: "AlignLeft" | "AlignRight" | "AlignCenter" | "AlignDefault";
};

export type ColWidth = {
	t: "ColWidth";
	c: number;
};

export type ColWidthDefault = {
	t: "ColWidthDefault";
};

export type TableCaption = [
	Array<Inline>, // short
	Array<Block>, // long
];

export type TableHead = [Attr, Array<TableRow>];

export type TableBody = [
	[
		Attr,
		number, // row head columns
		Array<TableRow>, // intermediate head
		Array<TableRow>, // body rows
	],
];

export type TableFoot = [Attr, Array<Block>];

export type TableRow = [Attr, Array<TableCell>];

export type TableCell = [
	Attr,
	Alignment,
	number, // row span
	number, // col span
	Array<Block>,
];

export type EltMap = {
	// Inline
	Str: string;
	Emph: Array<Inline>;
	Strong: Array<Inline>;
	Strikeout: Array<Inline>;
	Superscript: Array<Inline>;
	Subscript: Array<Inline>;
	SmallCaps: Array<Inline>;
	Quoted: [QuoteType, Array<Inline>];
	Cite: [Array<Citation>, Array<Inline>];
	Code: [Attr, string];
	Space: undefined;
	SoftBreak: undefined;
	LineBreak: undefined;
	Math: [MathType, string];
	RawInline: [Format, string];
	Link: [Attr, Array<Inline>, Target];
	Image: [Attr, Array<Inline>, Target];
	Note: Array<Block>;
	Span: [Attr, Array<Inline>];

	// Block
	Plain: Array<Inline>;
	Para: Array<Inline>;
	LineBlock: Array<Array<Inline>>;
	CodeBlock: [Attr, string];
	RawBlock: [Format, string];
	BlockQuote: Array<Block>;
	OrderedList: [ListAttributes, Array<Array<Block>>];
	BulletList: Array<Array<Block>>;
	DefinitionList: Array<[Array<Inline>, Array<Array<Block>>]>;
	Header: [number, Attr, Array<Inline>];
	HorizontalRule: undefined;
	Table: [
		Attr,
		TableCaption,
		Array<[Alignment, ColWidth | ColWidthDefault]>,
		TableHead,
		TableBody,
		TableFoot,
	];
	Div: [Attr, Array<Block>];
	Null: undefined;
};
export type EltType = keyof EltMap;

export type Elt<A extends EltType> = { t: A; c: EltMap[A] };

export type AnyElt = Inline | Block;

export type Inline =
	| Elt<"Str">
	| Elt<"Emph">
	| Elt<"Strong">
	| Elt<"Strikeout">
	| Elt<"Superscript">
	| Elt<"Subscript">
	| Elt<"SmallCaps">
	| Elt<"Quoted">
	| Elt<"Cite">
	| Elt<"Code">
	| Elt<"Space">
	| Elt<"SoftBreak">
	| Elt<"LineBreak">
	| Elt<"Math">
	| Elt<"RawInline">
	| Elt<"Link">
	| Elt<"Image">
	| Elt<"Note">
	| Elt<"Span">;

export type Block =
	| Elt<"Plain">
	| Elt<"Para">
	| Elt<"LineBlock">
	| Elt<"CodeBlock">
	| Elt<"RawBlock">
	| Elt<"BlockQuote">
	| Elt<"OrderedList">
	| Elt<"BulletList">
	| Elt<"DefinitionList">
	| Elt<"Header">
	| Elt<"HorizontalRule">
	| Elt<"Table">
	| Elt<"Div">
	| Elt<"Null">;

export type Tree = Array<Block | Inline>;

/** meta information about document, mostly from markdown frontmatter
 * https://hackage.haskell.org/package/pandoc-types-1.20/docs/Text-Pandoc-Definition.html#t:MetaValue
 */
export type PandocMetaValue =
	| { t: "MetaMap"; c: PandocMetaMap }
	| { t: "MetaList"; c: Array<PandocMetaValue> }
	| { t: "MetaBool"; c: boolean }
	| { t: "MetaInlines"; c: Inline[] }
	| { t: "MetaString"; c: string }
	| { t: "MetaBlocks"; c: Block[] };
export type PandocMetaMap = Record<string, PandocMetaValue>;

/**
 * Converts an action into a filter that reads a JSON-formatted pandoc
 * document from stdin, transforms it by walking the tree with the action, and
 * returns a new JSON-formatted pandoc document to stdout. The argument is a
 * function action(key, value, format, meta), where key is the type of the
 * pandoc object (e.g. 'Str', 'Para'), value is the contents of the object
 * (e.g. a string for 'Str', a list of inline elements for 'Para'), format is
 * the target output format (which will be taken for the first command
 * line argument if present), and meta is the document's metadata. If the
 * function returns None, the object to which it applies will remain
 * unchanged. If it returns an object, the object will be replaced. If it
 * returns a list, the list will be spliced in to the list to which the target
 * object belongs. (So, returning an empty list deletes the object.)
 *
 * @param  {Function} action Callback to apply to every object
 */
export async function toJSONFilter(action: FilterActionAsync) {
	const json = await getStdin();
	var data = JSON.parse(json);
	var format = process.argv.length > 2 ? process.argv[2] : "";
	filter(data, action, format).then((output) =>
		process.stdout.write(JSON.stringify(output)),
	);
}

function isElt(x: unknown): x is AnyElt {
	return (typeof x === "object" && x && "t" in x) || false;
}
function isEltArray(x: unknown[]): x is AnyElt[] {
	return x.every(isElt);
}
/**
 * Walk a tree, applying an action to every object.
 * @param  {Object}   x      The object to traverse
 * @param  {Function} action Callback to apply to each item
 * @param  {String}   format Output format
 * @param  {Object}   meta   Pandoc metadata
 * @return {Object}          The modified tree
 */
export async function walk(
	x: unknown,
	action: FilterActionAsync,
	format: Format,
	meta: PandocMetaMap,
): Promise<unknown> {
	if (typeof action === "function") action = { single: action };
	if (Array.isArray(x)) {
		if (action.array && isEltArray(x)) {
			x = await action.array(x, format, meta);
			if (!Array.isArray(x)) throw "impossible (just for ts)";
		}
		var array: unknown[] = [];
		for (const item of x) {
			if (isElt(item) && action.single) {
				var res = (await action.single(item, format, meta)) || item;
				if (Array.isArray(res)) {
					for (const z of res) {
						array.push(await walk(z, action, format, meta));
					}
				} else {
					array.push(await walk(res, action, format, meta));
				}
			} else {
				array.push(await walk(item, action, format, meta));
			}
		}
		return array;
	} else if (typeof x === "object" && x !== null) {
		var obj: any = {};
		for (const k of Object.keys(x)) {
			obj[k] = await walk((x as any)[k], action, format, meta);
		}
		return obj;
	}
	return x;
}

export function walkSync(
	x: unknown,
	action: (ele: AnyElt, format: string, meta: PandocMetaMap) => FAReturn,
	format: Format,
	meta: PandocMetaMap,
) {
	if (Array.isArray(x)) {
		var array: unknown[] = [];
		for (const item of x) {
			if (isElt(item)) {
				var res = action(item, format, meta) || item;
				if (Array.isArray(res)) {
					for (const z of res) {
						array.push(walkSync(z, action, format, meta));
					}
				} else {
					array.push(walkSync(res, action, format, meta));
				}
			} else {
				array.push(walkSync(item, action, format, meta));
			}
		}
		return array;
	} else if (typeof x === "object" && x !== null) {
		var obj: any = {};
		for (const k of Object.keys(x)) {
			obj[k] = walkSync((x as any)[k], action, format, meta);
		}
		return obj;
	}
	return x;
}

/**
 * Walks the tree x and returns concatenated string content, leaving out all
 * formatting.
 * @param  {Object} x The object to walk
 * @return {String}   JSON string
 */
export function stringify(x: Tree | AnyElt | { t: "MetaString"; c: string }) {
	if (!Array.isArray(x) && x.t === "MetaString") return x.c;

	var result: string[] = [];
	var go = function (e: AnyElt) {
		if (e.t === "Str") result.push(e.c);
		else if (e.t === "Code") result.push(e.c[1]);
		else if (e.t === "Math") result.push(e.c[1]);
		else if (e.t === "LineBreak") result.push(" ");
		else if (e.t === "Space") result.push(" ");
		else if (e.t === "SoftBreak") result.push(" ");
		else if (e.t === "Para") result.push("\n");
	};
	walkSync(x, go, "", {});
	return result.join("");
}

/**
 * Returns an attribute list, constructed from the dictionary attrs.
 * @param  {Object} attrs Attribute dictionary
 * @return {Array}        Attribute list
 */
export function attributes(attrs: {
	id?: string;
	classes?: string[];
	[k: string]: any;
}): Attr {
	attrs = attrs || {};
	var ident = attrs.id || "";
	var classes = attrs.classes || [];
	var keyvals: [string, string][] = [];
	Object.keys(attrs).forEach(function (k) {
		if (k !== "classes" && k !== "id") keyvals.push([k, attrs[k]]);
	});
	return [ident, classes, keyvals];
}

type IsTuple<T extends any[]> = number extends T["length"] ? false : true;
type WrapArray<T> = T extends undefined
	? []
	: T extends any[]
	? IsTuple<T> extends true
		? T
		: [T]
	: [T];

// Utility for creating constructor functions
export function elt<T extends EltType>(
	eltType: T,
	numargs: number,
): (...args: WrapArray<EltMap[T]>) => Elt<T> {
	return function (...args: WrapArray<EltMap[T]>) {
		var len = args.length;
		if (len !== numargs)
			throw (
				eltType + " expects " + numargs + " arguments, but given " + len
			);
		return { t: eltType, c: len === 1 ? args[0] : args } as any;
	};
}

/**
 * Filter the given object
 */
export async function filter(
	data: PandocJson,
	action: FilterActionAsync,
	format: Format,
) {
	return (await walk(
		data,
		action,
		format,
		data.meta || (data as any)[0].unMeta,
	)) as PandocJson;
}

type RawMetaRecord = { [name: string]: RawMeta };
type RawMeta = string | boolean | RawMetaRecord | Array<RawMeta>;
/** `.meta` in the pandoc json format describes the markdown frontmatter yaml as an AST as described in
 *  https://hackage.haskell.org/package/pandoc-types-1.20/docs/Text-Pandoc-Definition.html#t:MetaValue
 *
 * this function converts a raw object to a pandoc meta AST object
 **/
export function rawToMeta(e: RawMeta): PandocMetaValue {
	if (Array.isArray(e)) {
		return { t: "MetaList", c: e.map((x) => rawToMeta(x)) };
	}
	// warning: information loss: can't tell if it was a number or string
	if (typeof e === "string" || typeof e === "number")
		return { t: "MetaString", c: String(e) };
	if (typeof e === "object") {
		const c = fromEntries(
			Object.entries(e).map(([k, v]) => [k, rawToMeta(v)]),
		);
		return { t: "MetaMap", c };
	}
	if (typeof e === "boolean") return { t: "MetaBool", c: e };
	throw Error(typeof e);
}

export function metaToRaw(m: PandocMetaValue): RawMeta {
	if (m.t === "MetaMap") {
		return fromEntries(
			Object.entries(m.c).map(([k, v]) => [k, metaToRaw(v)]),
		);
	} else if (m.t === "MetaList") {
		return m.c.map(metaToRaw);
	} else if (m.t === "MetaBool" || m.t === "MetaString") {
		return m.c;
	} else if (m.t === "MetaInlines" || m.t === "MetaBlocks") {
		// warning: information loss: removes formatting
		return stringify(m.c);
	}
	throw Error(`Unknown meta type ${(m as any).t}`);
}
/** meta root object is a map */
export function metaMapToRaw(c: PandocMetaMap): RawMetaRecord {
	return metaToRaw({ t: "MetaMap", c }) as any;
}

/** Object.fromEntries ponyfill */
function fromEntries<V>(iterable: Iterable<[string, V]>): Record<string, V> {
	return [...iterable].reduce((obj, [key, val]) => {
		obj[key] = val;
		return obj;
	}, {} as Record<string, V>);
}

// Constructors for block elements

export const Plain = elt("Plain", 1);
export const Para = elt("Para", 1);
export const CodeBlock = elt("CodeBlock", 2);
export const RawBlock = elt("RawBlock", 2);
export const BlockQuote = elt("BlockQuote", 1);
export const OrderedList = elt("OrderedList", 2);
export const BulletList = elt("BulletList", 1);
export const DefinitionList = elt("DefinitionList", 1);
export const Header = elt("Header", 3);
export const HorizontalRule = elt("HorizontalRule", 0);
export const Table = elt("Table", 6);
export const Div = elt("Div", 2);
export const Null = elt("Null", 0);

// Constructors for inline elements

export const Str = elt("Str", 1);
export const Emph = elt("Emph", 1);
export const Strong = elt("Strong", 1);
export const Strikeout = elt("Strikeout", 1);
export const Superscript = elt("Superscript", 1);
export const Subscript = elt("Subscript", 1);
export const SmallCaps = elt("SmallCaps", 1);
export const Quoted = elt("Quoted", 2);
export const Cite = elt("Cite", 2);
export const Code = elt("Code", 2);
export const Space = elt("Space", 0);
export const LineBreak = elt("LineBreak", 0);
export const Formula = elt("Math", 2); // don't conflict with js builtin Math;
export const RawInline = elt("RawInline", 2);
export const Link = elt("Link", 3);
export const Image = elt("Image", 3);
export const Note = elt("Note", 1);
export const Span = elt("Span", 2);

// a few aliases
export const stdio = toJSONFilter;
