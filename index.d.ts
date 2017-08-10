export type FilterAction =
    <A extends keyof EltMap>(
        key : A,
        value : EltMap[A],
        format : string,
        meta : any
    ) => undefined | Elt<keyof EltMap> | Array<Elt<keyof EltMap>>;

export type AttrList = Array<[string, string]>;

export type Attr = [string, Array<string>, AttrList];

export type MathType = "DisplayMath" | "InlineMath";
export type QuoteType = "SingleQuote" | "DoubleQuote";
export type Target = [string, string]; // [url, title]
export type Format = string;

export type CitationMode = "AuthorInText" | "SuppressAuthor" | "NormalCitation";

export type Citation = {
    citationId : string;
    citationPrefix : Array<Inline>;
    citationSuffix : Array<Inline>;
    citationMode : CitationMode;
    citationNoteNum : number;
    citationHash : number;
};

export type ListNumberStyle
    = "DefaultStyle"
    | "Example"
    | "Decimal"
    | "LowerRoman"
    | "UpperRoman"
    | "LowerAlpha"
    | "UpperAlpha";

export type ListNumberDelim
    = "DefaultDelim"
    | "Period"
    | "OneParen"
    | "TwoParens";

export type ListAttributes = [number, ListNumberStyle, ListNumberDelim];

export type Alignment
    = "AlignLeft"
    | "AlignRight"
    | "AlignCenter"
    | "AlignDefault";

export type TableCell = Array<Block>;

export type EltMap = {
    // Inline
    Str : string;
    Emph : Array<Inline>;
    Strong : Array<Inline>;
    Strikeout : Array<Inline>;
    Superscript : Array<Inline>;
    Subscript : Array<Inline>;
    SmallCaps : Array<Inline>;
    Quoted : [QuoteType, Array<Inline>];
    Cite : [Array<Citation>, Array<Inline>];
    Code : [Attr, string];
    Space : undefined;
    SoftBreak : undefined;
    LineBreak : undefined;
    Math : [MathType, string];
    RawInline : [Format, string];
    Link : [Attr, Array<Inline>, Target];
    Image : [Attr, Array<Inline>, Target];
    Note : Array<Block>;
    Span : [Attr, Array<Inline>];

    // Block
    Plain : Array<Inline>;
    Para : Array<Inline>;
    LineBlock : Array<Array<Inline>>;
    CodeBlock : [Attr, string];
    RawBlock : [Format, string];
    BlockQuote : Array<Block>;
    OrderedList : [ListAttributes, Array<Array<Block>>];
    BulletList : Array<Array<Block>>;
    DefinitionList : Array<[Array<Inline>, Array<Array<Block>>]>;
    Header : [number, Attr, Array<Inline>];
    HorizontalRule : undefined;
    Table : [
        Array<Inline>,
        Array<Alignment>,
        Array<number>,
        Array<TableCell>,
        Array<Array<TableCell>>
    ];
    Div : [Attr, Array<Block>];
    Null : undefined;
};

export type Elt<A extends keyof EltMap> = {t : A, c : EltMap[A]};

export type Inline
    = Elt<"Str">
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

export type Block
    = Elt<"Plain">
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

export type Tree = Array<Block> | Array<Inline>;

export function Str(a : string) : Elt<"Str">;
export function Emph(a : Array<Inline>) : Elt<"Emph">;
export function Strong(a : Array<Inline>) : Elt<"Strong">;
export function Strikeout(a : Array<Inline>) : Elt<"Strikeout">;
export function Superscript(a : Array<Inline>) : Elt<"Superscript">;
export function Subscript(a : Array<Inline>) : Elt<"Subscript">;
export function SmallCaps(a : Array<Inline>) : Elt<"SmallCaps">;
export function Quoted(a : QuoteType, b : Array<Inline>) : Elt<"Quoted">;
export function Cite(a : Array<Citation>, b : Array<Inline>) : Elt<"Cite">;
export function Code(a : Attr, b : string) : Elt<"Code">;
export function Space() : Elt<"Space">;
export function SoftBreak() : Elt<"SoftBreak">;
export function LineBreak() : Elt<"LineBreak">;
export function Math(a : MathType, b : string) : Elt<"Math">;
export function RawInline(a : Format, b : string) : Elt<"RawInline">;
export function Link(a : Attr, b : Array<Inline>, c : Target) : Elt<"Link">;
export function Image(a : Attr, b : Array<Inline>, c : Target) : Elt<"Image">;
export function Note(a : Array<Block>) : Elt<"Note">;
export function Span(a : Attr, b : Array<Inline>) : Elt<"Span">;


export function Plain(a : Array<Inline>) : Elt<"Plain">;
export function Para(a : Array<Inline>) : Elt<"Para">;
export function LineBlock(a : Array<Array<Inline>>) : Elt<"LineBlock">;
export function CodeBlock(a : Attr, b : string) : Elt<"CodeBlock">;
export function RawBlock(a : Format, b : string) : Elt<"RawBlock">;
export function BlockQuote(a : Array<Block>) : Elt<"BlockQuote">;
export function OrderedList(a : ListAttributes, b : Array<Array<Block>>) : Elt<"OrderedList">;
export function BulletList(a : Array<Array<Block>>) : Elt<"BulletList">;
export function DefinitionList(a : Array<[Array<Inline>, Array<Array<Block>>]>) : Elt<"DefinitionList">;
export function Header(a : number, b : Attr, c : Array<Inline>) : Elt<"Header">;
export function HorizontalRule() : Elt<"HorizontalRule">;
export function Table(
    a : Array<Inline>,
    b : Array<Alignment>,
    c : Array<number>,
    d : Array<TableCell>,
    e : Array<Array<TableCell>>
) : Elt<"Table">;
export function Div(a : Attr, b : Array<Block>) : Elt<"Div">;
export function Null() : Elt<"Null">;

export function toJSONFilter(action : FilterAction) : void;
export function stdio(action : FilterAction) : void;

export function walk(tree : Tree, action : FilterAction, format : Format, meta : any) : Tree;

export function filter(tree : Tree, action : FilterAction, format : Format) : Tree;

export function attributes(attrs : {[k : string] : string}) : Attr;

export function stringify(tree : Tree) : string;
