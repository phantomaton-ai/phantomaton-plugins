import sigilium from 'sigilium';
import create from './create.js';
import define from './define.js';

const compose = name => sigilium.composite(name);
const single = name => sigilium.singleton(name);

export default {
  create,
  define,
  compose,
  single
};