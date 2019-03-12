import React, { PureComponent, Fragment } from 'react';

import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';

import tokenize from 'lib/refractor';

class DiffView extends PureComponent {
  render() {
    const { diff, source } = this.props;
    const files = parseDiff(diff);
    files.forEach((f) => {
      f.tokens = tokenize(f.hunks, source);
    });
    return files.map(file => (
      <Diff viewType="unified" hunks={file.hunks} tokens={file.tokens} diffType="modify">
        {hunks => hunks.map(h => (
          <Fragment key={h.content}>
            <Decoration>...</Decoration>
            <Hunk hunk={h} />
          </Fragment>
        ))
        }
      </Diff>
    ));
  }
}
export default DiffView;
