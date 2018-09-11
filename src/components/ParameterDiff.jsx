import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

const emptyValue = '-';

const ParameterDiffTableData = data => (
  <Fragment key={data}>
    {Object.keys(data).map(key => (
      <Fragment key={data[key].Parameter}>
        <tr key={data[key].Parameter + data[key].DefaultValue}>
          <td>{data[key].Parameter ? data[key].Parameter : emptyValue}</td>
          <td>{data[key].DefaultValue ? data[key].DefaultValue : emptyValue}</td>
          <td className="oldValue">{data[key].NewValue ? data[key].NewValue : emptyValue}</td>
          <td className="newValue">{data[key].OldValue ? data[key].OldValue : emptyValue}</td>
        </tr>
      </Fragment>
    ))}
  </Fragment>
);

class ParameterDiff extends Component {
  static headers = ['Parameter', 'Default Value', 'Old Value', 'New Value'];

  state = {
    parameterDiffSet: null,
  };

  componentDidMount() {
    this.reformat();
  }

  reformat = () => {
    const { set } = this.props;
    if (!this.isEmpty(set)) {
      Object.keys(set).forEach((key) => {
        set[key].Parameter = key;
      });
      this.setState({ parameterDiffSet: [set] });
    } else {
      this.setState({ parameterDiffSet: [] });
    }
  };

  isEmpty = obj => Object.keys(obj).length === 0;

  render() {
    const { parameterDiffSet } = this.state;
    return (
      <Fragment>
        <Table
          headers={ParameterDiff.headers}
          renderData={ParameterDiffTableData}
          data={parameterDiffSet}
          render
        />
      </Fragment>
    );
  }
}

ParameterDiff.propTypes = {
  set: PropTypes.objectOf(PropTypes.any),
};

ParameterDiff.defaultProps = {
  set: {},
};

export default ParameterDiff;
