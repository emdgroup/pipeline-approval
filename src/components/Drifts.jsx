import React from 'react';

import { parseDiff, Diff, Hunk, textLinesToHunk, insertHunk } from 'react-diff-view';

import tokenize from 'lib/refractor';

export default React.memo(({ drifts }) => {
  const modified = drifts.filter(d => d.StackResourceDriftStatus === 'MODIFIED');
  modified.forEach((m) => {
    m.ParsedDiff = parseDiff(m.DriftDiff)[0];
    const { hunks } = m.ParsedDiff;
    let newLine = 1;
    let oldLine = 1;
    const addHunks = [];
    const lines = m.ActualProperties.split('\n');
    hunks.forEach((h) => {
      if (h.newStart > newLine) {
        const hunk = textLinesToHunk(lines.slice(newLine - 1, h.newStart), newLine, oldLine);
        m.ParsedDiff.hunks = insertHunk(m.ParsedDiff.hunks, hunk);
      }
      newLine = h.newStart + h.newLines;
      oldLine = h.oldStart + h.oldLines;
    });

    m.ParsedDiff.tokens = tokenize(m.ParsedDiff.hunks);
  });

  return (
    <div>
      {modified.map(d => (
        <div key={d.LogicalResourceId}>
          <p>{d.LogicalResourceId}</p>
          <Diff
            viewType="unified"
            gutterType="none"
            diffType="modify"
            tokens={d.ParsedDiff.tokens}
            hunks={d.ParsedDiff.hunks}
          >
            {hunks => hunks.map(h => <Hunk hunk={h} key={h.content} />)}
          </Diff>
        </div>
      ))}
    </div>
  );
});
