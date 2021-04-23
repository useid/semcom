/* NOTE: this can also be in 'commitlint' object of package.json, e.g. extending from private package */

/* Enable to extend Lerna scopes */
// const {utils: {getPackages}} = require('@commitlint/config-lerna-scopes');

module.exports = {
    extends: [

        /* Enable to only allow Lerna scopes */
        //'@commitlint/config-lerna-scopes',

        /* Enable to enforce conventional commit format */
        '@commitlint/config-conventional',

    ],
    rules: {

        /* Enable to enforce use of scopes */
        //'scope-empty': [2, 'never'],

        /* Enable to extend Lerna scopes */
        //'scope-enum': async ctx => [2, 'always', [...(await getPackages(ctx)), 'multi']],

        /* Enable to override default conventional commit types (always include FEAT & FIX) */
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'build', 'test']],

    }
};
