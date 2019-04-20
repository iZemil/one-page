module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "extends": ["airbnb", "prettier", "prettier/react"],
    "plugins": ["import", "jsx-a11y", "react", "prettier"],
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "jest": true
    },
    "rules": {
        "react/prop-types": 0,
        "class-methods-use-this": "off",
        "curly": ["error", "all"], // All blocks must be wrapped in curly braces {}
        "function-paren-newline": "off",
        "global-require": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off", // For absolute import support
        // Allowing importing from dev deps (for stories and tests)
        "import/no-extraneous-dependencies": "off",
        // Allowing warning and error console logging
        "no-console": [
            "error",
            {
                "allow": ["warn", "error", "info"]
            }
        ],
        // Disallow more than 1 empty lines
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1
            }
        ],
        // Cannot reassign function parameters but allowing modification
        "no-param-reassign": [
            "error",
            {
                "props": false
            }
        ],
        "no-plusplus": "off",
        "no-underscore-dangle": 1,
        // Allowing Math.pow rather than forcing `**`
        "no-restricted-properties": [
            "off",
            {
                "object": "Math",
                "property": "pow"
            }
        ],
        "object-curly-newline": "off",
        "padded-blocks": ["error", "never"], // Enforce no padding within blocks
        "prefer-destructuring": "off",
        "prettier/prettier": "error",
        "react/jsx-filename-extension": [
            "error",
            {
                "extensions": [".js", ".jsx"]
            }
        ],
        // JSX props must be in alphabetical order
        // Disabled as this is creating too much noise in logs and is not being actively addressed
        "react/jsx-sort-props": "off",
        // This was turned off for wc - but should be re-enabled eventually
        "react/no-unknown-property": ["off"],
        // Adding 'skipShapeProps' as the rule has issues with correctly handling PropTypes.shape
        "react/no-unused-prop-types": [
            "error",
            {
                "skipShapeProps": true
            }
        ],
        "react/prefer-stateless-function": "warn",
        "react/require-default-props": "off",
        "consistent-return": 1
    },
    "settings": {
        "react": {
            "version": "detect"
        },
        "import/resolver": {
            webpack: {
                config: {
                    resolve: {
                        alias: require('./webpack/alias')
                    }
                }
            }
        }
    }
}
