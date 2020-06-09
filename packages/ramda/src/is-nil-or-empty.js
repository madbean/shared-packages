const { isNil, isEmpty, anyPass } = require('ramda');

export const isNilOrEmpty = anyPass([isNil, isEmpty]);