import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChangeSets from './ChangeSets';

class PipelineChanges extends Component {
  state = {};

  render() {
    const { changes } = this.props;
    return (
      <Fragment>
        {/* {Changes
          ? ParameterDiffs.map(diff => (
            <div key={diff} dangerouslySetInnerHTML={{ __html: diff }} />
          ))
          : null} */}
        <ChangeSets changes={changes} />
      </Fragment>
    );
  }
}

PipelineChanges.propTypes = {
  changes: PropTypes.objectOf(PropTypes.any)
};

PipelineChanges.defaultProps = {
  changes: {}
};

export default PipelineChanges;
