# postcss-rcs

[![Build Status](https://travis-ci.org/JPeer264/postcss-rcs.svg?branch=master)](https://travis-ci.org/JPeer264/postcss-rcs)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/postcss-rcs/badge.svg?branch=master)](https://coveralls.io/github/JPeer264/postcss-rcs?branch=master)

> The PostCSS plugin for [rcs-core](https://github.com/JPeer264/node-rcs-core)

## Installation

```sh
$ npm i postcss-rcs -S
```

or

```sh
$ yarm add postcss-rcs
```

## Usage

```js
postcss([ require('postcss-rcs') ])
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.

## What does it do

```css
@keyframes move {
  from {}
  to {}
}

@media screen and (min-width: 480px) {
  .selector {
    background-color: lightgreen;
    animation: move 4s infinite;
    animation-name: move;
  }
}

.main.selector {
  border: 1px solid black;
}

ul li {
  padding: 5px;
}
```

will be processed to:

```css
@keyframes move {
  from {}
  to {}
}

@media screen and (min-width: 480px) {
  .a {
    background-color: lightgreen;
    animation: move 4s infinite;
    animation-name: move;
  }
}

.b.a {
  border: 1px solid black;
}

ul li {
  padding: 5px;
}
```

## Options

Call the plugin to set options:

```js
postcss([ require('postcss-simple-vars')({ replaceKeyframes: true }) ])
```

- [replaceKeyframes](#replacekeyframes)
- [ignoreAttributeSelector](#ignoreattributeselector)
- [prefix](#prefix)
- [suffix](#suffix)

### replaceKeyframes

Replaces `animation` and `animation-name` if a specific `@keyframes` is set.

Type: `boolean`

Default: `false`

Example:

```css
// { replaceKeyframes: true }
@keyframes move {
  from {}
  to {}
}

.selector {
  animation: move 4s infinite;
  animation-name: move;
}
```

will be processed to:

```css
// { replaceKeyframes: true }
@keyframes a {
  from {}
  to {}
}

.b {
  animation: a 4s infinite;
  animation-name: a;
}
```

### ignoreAttributeSelector

If set to `true` it does not care about attribute selectors. If set to `false` the attribute selector `[class$="lector"]` will not rename `.selector` as it the class ends with `lector`.

Type: `boolean`

Default: `false`

Example:

**{ ignoreAttributeSelector: false }**
```css
.move[class$="lector"] {}
.selector {}
```

will be process to:
```css
.a[class$="lector"] {}
.selector {}
```

**{ ignoreAttributeSelector: true }**
```css
.move[class$="lector"] {}
.selector {}
```

will be process to:
```css
.a[class$="lector"] {}
.b {}
```

### prefix

Prefixes every selectors and attribute selectors (if `ignoreAttributeSelector` is `false`).

Type: `string`

Default: `''`

Example:
```css
// { ignoreAttributeSelector: false, prefix: 'pre-' }
.move[class^="sel"] {}
.selector {}
```

will be process to:
```css
// { ignoreAttributeSelector: false, prefix: 'pre-' }
.pre-a[class^="pre-sel"] {}
.pre-selector {}
```

### suffix

Suffixes every selectors and attribute selectors (if `ignoreAttributeSelector` is `false`).

Type: `string`

Default: `''`

Example:
```css
// { ignoreAttributeSelector: false, suffix: '-suf' }
.move[class$="lector"] {}
.selector {}
```

will be process to:
```css
// { ignoreAttributeSelector: false, suffix: '-suf' }
.a-suf[class$="lector-suf"] {}
.selector-suf {}
```
