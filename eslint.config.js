import ressurectit from 'eslint-plugin-ressurectit';

export default
[
    ...ressurectit.configs.recommended,
    {
        rules:
        {
            '@stylistic/lines-between-class-members': 'off',
            '@stylistic/indent-binary-ops': 'off',
            '@stylistic/no-floating-decimal': 'off',
            '@stylistic/keyword-spacing':
            [
                'warn',
                {
                    before: false,
                    after: false,
                    overrides:
                    {
                        import:
                        {
                            after: true,
                        },
                        from:
                        {
                            before: true,
                            after: true,
                        },
                        extends:
                        {
                            before: true,
                        },
                        as:
                        {
                            before: true,
                        },
                        return:
                        {
                            after: true,
                        },
                    },
                },
            ],
        },
    },
];
