import postcss from 'postcss';
import rcs from 'rcs-core';

const replaceCssSelector = (match) => {
  const result = rcs.selectorLibrary.get(match, {
    addSelectorType: true,
  });

  return result;
}; // /replaceCssSelector

const postcssRcs = postcss.plugin('rcs', (options = {}) => (
  (root) => {
    const data = root.toString();

    rcs.fillLibraries(data, options);

    // do a regex of all setted attributes
    const regexOfAllSelectors = rcs.selectorLibrary.getAll({
      addSelectorType: true,
      regexCss: true,
    });

    root.walkRules((rule) => {
      // * --------------------------- *
      // * replace selector attributes *
      // * --------------------------- *
      const replaceEscapes = /\\/g;

      if (!options.ignoreAttributeSelectors) {
        rule.selector = rule.selector.replace(replaceEscapes, '').replace(rcs.replace.regex.attributeSelectors, (match) => {
          const re = new RegExp(rcs.replace.regex.attributeSelectors);
          const exec = re.exec(match);
          const stringChar = exec[3].charAt(0);
          const stringWithoutStringChars = exec[3].slice(1, exec[3].length - 1);

          let result = match;
          let newString = exec[3];

          // just add a suffix
          if (exec[2] === '$' && typeof options.suffix === 'string') {
            newString = stringChar + stringWithoutStringChars + options.suffix + stringChar;
          }

          // just add a prefix
          if (exec[2] === '^' && typeof options.suffix === 'string') {
            newString = stringChar + options.prefix + stringWithoutStringChars + stringChar;
          }

          result = result.replace(rcs.replace.regex.strings, newString);

          return result;
        });
      }

      // * ----------------- *
      // * replace selectors *
      // * ----------------- *
      rule.selector = rule.selector.replace(replaceEscapes, '').replace(regexOfAllSelectors, replaceCssSelector);
    });

    // * ----------------- *
    // * replace keyframes *
    // * ----------------- *
    if (options.replaceKeyframes) {
      // @keyframes
      root.walkAtRules((atRule) => {
        if (!atRule.name.match(/keyframes$/)) {
          return;
        }

        atRule.params = atRule.params.replace(/[a-zA-Z-_]+/g, match => rcs.keyframesLibrary.get(match, { addSelectorType: true }));
      });

      // animation | animation-name
      root.walkDecls((decl) => {
        if (!decl.prop.match(/(animation|animation-name)/)) {
          return;
        }

        // match the first word
        decl.value = decl.value.replace(/[a-zA-Z0-9-_]+/, match => (
          rcs.keyframesLibrary.get(match, { addSelectorType: true })
        ));
      });
    }
  }
));

export default postcssRcs;
