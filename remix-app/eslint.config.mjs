import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import todoComment from 'eslint-plugin-todo-comment'
import eslintPluginTsdoc from 'eslint-plugin-tsdoc'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // TODOコメントには必ずチケットのURLを記載するためルール追加
    plugins: {
      'todo-comment': todoComment,
    },
    rules: {
      'todo-comment/ticket-url': 'error',
    },
  },
  // TSDocコメントの文法チェックのため追加
  {
    plugins: {
      tsdoc: eslintPluginTsdoc,
    },
    rules: {
      'tsdoc/syntax': 'error',
    },
  },
  // pino等のloggerのみ使ってほしいためconsole.logを禁止
  {
    rules: {
      'no-console': 'error',
    },
  },
  // 上記のconsole.logの禁止はnode:consoleで回避できてしまうため、importを禁止
  {
    rules: {
      'no-restricted-imports': ['error', { paths: ['node:console'] }],
    },
  },
  {
    ignores: ['node_modules', '.turbo', 'dist', '.env'],
  },
)