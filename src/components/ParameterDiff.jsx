import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

const emptyValue = '-';

const ParameterDiffTableData = data => (
  <Fragment>
    {data.map(({ Name, Default, CurrentValue, NewValue }) => (
      <tr key={Name}>
        <td>{Name}</td>
        <td>{Default}</td>
        <td className="oldValue">{CurrentValue}</td>
        <td className="newValue">{NewValue}</td>
      </tr>
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
