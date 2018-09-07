import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

const ChangeSetsTableData = (data) => {
  const getBadge = (state) => {
    switch (state) {
      case 'Add':
        return 'badge-success';
      case 'Remove':
        return 'badge-danger';
      case 'Modify':
        return 'badge-warning';
      default:
        return 'badge-warning';
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
            {data.ResourceChange.Action}
          </span>
        </td>
        <td>{data.ResourceChange.LogicalResourceId}</td>
        <td>
          {data.ResourceChange.PhysicalResourceId ? data.ResourceChange.PhysicalResourceId : null}
        </td>
        <td>{data.ResourceChange.ResourceType}</td>
        <td>{data.ResourceChange.Replacement ? data.ResourceChange.Replacement : null}</td>
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
