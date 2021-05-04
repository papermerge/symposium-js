# SymposiumJS

Symposium is a javascript framework used across all frontend components of
[Papermerge](www.papermerge.com) project.

It is heavily inspired by [BackboneJS](https://backbonejs.org/) with important
differences that Symposium  does *not* depend on [jQuery](https://jquery.com/)
and [UnderscroreJS](https://underscorejs.org/). Also, Symposium is entirely
written using ES6 compliant javascript.


## Installation

Install all nodejs dependent packages:

    $ npm i  # looks in package.json and installs dependencies


## Run Tests

Test suite uses [mocha](https://mochajs.org/) as testing frameworks and [karma](https://karma-runner.github.io/latest/index.html) test runner.

To run test suite use following command:

    $ make test
