import React, { PureComponent } from 'react';

import {
  parseDiff,
  Diff,
} from 'react-diff-view';


class DiffView extends PureComponent {
  render() {
    const { diff, source } = this.props;
    const files = parseDiff(diff);
    return files.map(file => <Diff viewType="split" hunks={file.hunks} oldSource={source} />);
  }
}
export default DiffView;
