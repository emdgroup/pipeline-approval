import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

const emptyValue = '-';

const ChangeSetsTableData = (data) => {
  const getBadge = (action) => {
    switch (action) {
      case 'Add':
        return 'badge-success';
      case 'Remove':
        return 'badge-danger';
      case 'Modify':
        return 'badge-warning';
      default:
        return 'badge-light';
    }
  };
  return (
    <Fragment
      key={
        data.ResourceChange.LogicalResourceId
        + data.ResourceChange.ResourceType
        + data.ResourceChange.Action
      }
    >
      <tr key={data.ResourceChange.PhysicalResourceId + data.ResourceChange.ResourceType}>
        <td>
          <span className={`badge ${getBadge(data.ResourceChange.Action)}`}>
            {data.ResourceChange.Action ? data.ResourceChange.Action : emptyValue}
          </span>
        </td>
        <td>
          {data.ResourceChange.LogicalResourceId
            ? data.ResourceChange.LogicalResourceId
            : emptyValue}
        </td>
        <td>
          {data.ResourceChange.PhysicalResourceId
            ? data.ResourceChange.PhysicalResourceId
            : emptyValue}
        </td>
        <td>{data.ResourceChange.ResourceType ? data.ResourceChange.ResourceType : emptyValue}</td>
        <td>{data.ResourceChange.Replacement ? data.ResourceChange.Replacement : emptyValue}</td>
      </tr>
    </Fragment>
  );
};

class ChangeSets extends Component {
  static headers = ['Action', 'Logical ID', 'Physical ID', 'Resource Type', 'Replacement'];

  render() {
    const { set } = this.props;
    return (
      <Fragment>
        <Table headers={ChangeSets.headers} renderData={ChangeSetsTableData} data={set} render />
      </Fragment>
    );
  }
}

ChangeSets.propTypes = {
  set: PropTypes.arrayOf(PropTypes.any),
};

ChangeSets.defaultProps = {
  set: [],
};

export default ChangeSets;
