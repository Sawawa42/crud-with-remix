// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  singleQuote: true,
  // NOTE:
  // https://github.com/prettier/prettier/issues/12424
  // https://www.reddit.com/r/webdev/comments/n0agbi/what_is_your_stance_on_the_80_characters_limit_on/
  // https://3shake.slack.com/archives/C01K4LH96MS/p1717396004090059?thread_ts=1717391337.891079&cid=C01K4LH96MS
  printWidth: 120,
  endOfLine: 'lf',
}

module.exports = config