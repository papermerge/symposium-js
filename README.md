[![Unittests](https://github.com/papermerge/symposium/actions/workflows/unittests.yml/badge.svg)](https://github.com/papermerge/symposium/actions/workflows/unittests.yml)

# SymposiumJS

Symposium is a javascript framework used across all frontend components of
[Papermerge](www.papermerge.com) project.

It is heavily inspired by [BackboneJS](https://backbonejs.org/).
Symposium is entirely written using ES6 compliant javascript.

It has light dependency on [jQuery](https://jquery.com) and
[nunjucks](https://mozilla.github.io/nunjucks/). "Light" dependency means that
the dependencies are kept minimal so that they can be removed/replaced easily.
From jQuery only event related methods are used - ``$(selector).on`` and
``$(selector).off``.


## Installation

Install all nodejs dependent packages:

    $ npm i  # looks in package.json and installs dependencies


## Run Tests

Test suite uses [mocha](https://mochajs.org/) as testing frameworks and [karma](https://karma-runner.github.io/latest/index.html) test runner.

To run test suite use following command:

    $ make test
