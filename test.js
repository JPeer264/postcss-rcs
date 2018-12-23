import test from 'ava';
import postcss from 'postcss';
import rcs from 'rcs-core';

import postcssRcs from './index';

const replaceKeyframes = postcssRcs({ replaceKeyframes: true });
const ignoreAttributeSeletor = postcssRcs({ ignoreAttributeSelectors: true });
const prefix = postcssRcs({ prefix: 'pre-' });
const suffix = postcssRcs({ suffix: '-suf' });
const presuf = postcssRcs({ prefix: 'pre-', suffix: '-suf' });
const keyframesAndAttributeSelectors = postcssRcs({
  ignoreAttributeSelectors: true,
  replaceKeyframes: true,
});

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test('generell rename test', (t) => {
  const input = `
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
  `;
  const expectedResult = `
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
  `;

  const result = postcss([postcssRcs()]).process(input);

  t.is(result.css, expectedResult);
});

test('do not replace keyframes', (t) => {
  const input = `
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
  `;
  const expectedResult = `
    @keyframes a {
      from {}
      to {}
    }

    @media screen and (min-width: 480px) {
        .b {
            background-color: lightgreen;
            animation: a 4s infinite;
            animation-name: a;
        }
    }

    .c.b {
        border: 1px solid black;
    }

    ul li {
      padding: 5px;
    }
  `;

  const result = postcss([replaceKeyframes]).process(input);

  t.is(result.css, expectedResult);
});

test('prefix', (t) => {
  const input = `
    .main.selector {
        border: 1px solid black;
    }

    ul li {
      padding: 5px;
    }
  `;
  const expectedResult = `
    .pre-a.pre-b {
        border: 1px solid black;
    }

    ul li {
      padding: 5px;
    }
  `;

  const result = postcss([prefix]).process(input);

  t.is(result.css, expectedResult);
});

test('suffix', (t) => {
  const input = `
    .main.selector {
        border: 1px solid black;
    }

    ul li {
      padding: 5px;
    }
  `;
  const expectedResult = `
    .a-suf.b-suf {
        border: 1px solid black;
    }

    ul li {
      padding: 5px;
    }
  `;

  const result = postcss([suffix]).process(input);

  t.is(result.css, expectedResult);
});

test('prefix suffix and selector attributes', (t) => {
  const input = `
    .main.selector {
        border: 1px solid black;
    }

    ul[class^="test"] li[class$="ctor"] {
      padding: 5px;
    }
  `;
  const expectedResult = `
    .pre-a-suf.pre-tctor-suf {
        border: 1px solid black;
    }

    ul[class^="pre-test"] li[class$="ctor-suf"] {
      padding: 5px;
    }
  `;

  const result = postcss([presuf]).process(input);

  t.is(result.css, expectedResult);
});

test('ignore selector attributes', (t) => {
  const input = `
    .main.selector {
        border: 1px solid black;
    }

    ul[class^="test"] li[class$="ctor"] {
      padding: 5px;
    }
  `;
  const expectedResult = `
    .a.b {
        border: 1px solid black;
    }

    ul[class^="test"] li[class$="ctor"] {
      padding: 5px;
    }
  `;

  const result = postcss([ignoreAttributeSeletor]).process(input);

  t.is(result.css, expectedResult);
});

test('ignore attribute selector and set keyframes', (t) => {
  const input = `
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

    ul li[class$="ctor"] {
      padding: 5px;
    }
  `;
  const expectedResult = `
    @keyframes a {
      from {}
      to {}
    }

    @media screen and (min-width: 480px) {
        .b {
            background-color: lightgreen;
            animation: a 4s infinite;
            animation-name: a;
        }
    }

    .c.b {
        border: 1px solid black;
    }

    ul li[class$="ctor"] {
      padding: 5px;
    }
  `;

  const result = postcss([keyframesAndAttributeSelectors]).process(input);

  t.is(result.css, expectedResult);
});

test('replace escaped selectors', (t) => {
  const input = `
    .main.selector\\:test:after {
        border: 1px solid black;
    }
  `;
  const expectedResult = `
    .a.b:after {
        border: 1px solid black;
    }
  `;

  const result = postcss([ignoreAttributeSeletor]).process(input);

  t.is(result.css, expectedResult);
});
