import {tokenize} from 'react-diff-view'
import refractor from 'refractor/core';

import YAML from 'refractor/lang/yaml';

refractor.register(YAML);

export default function (hunks, oldSource) {
  return tokenize(hunks, {
    highlight: true,
    refractor,
    oldSource,
    language: 'yaml',
  });
};
