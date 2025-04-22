import sigilium from 'sigilium';
import priestess from 'priestess';

import create from './create.js';
import decorate from './decorate.js';
import define from './define.js';

const { composite, optional, singleton } = sigilium;
const { start, input } = priestess;

export default { create, decorate, define, composite, optional, singleton, start, input };