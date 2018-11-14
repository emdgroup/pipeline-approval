import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

const emptyValue = '-';

const getBadge = (action) => {
  switch (action) {
    case 'Add':
      return 'badge-success';
    case 'Remove':
      return 'badge-danger';
    case 'Modify':
      return 'badge-info';
    case 'Replace':
      return 'badge-warning';
    default:
      return 'badge-light';
  }
};

const ChangeSetsTableData = ({ ResourceChange }) => {
  const action = ResourceChange.Replacement ? 'Replace' : ResourceChange.Action;
  return (
    <Fragment key={ResourceChange.LogicalResourceId}>
      <tr key={ResourceChange.PhysicalResourceId + ResourceChange.ResourceType}>
        <td>
          <span className={`badge ${getBadge(action)}`}>{action || emptyValue}</span>
        </td>
        <td>{ResourceChange.LogicalResourceId || emptyValue}</td>
        <td>{ResourceChange.PhysicalResourceId || emptyValue}</td>
        <td>{ResourceChange.ResourceType || emptyValue}</td>
      </tr>
    </Fragment>
  );
};

class ChangeSets extends Component {
  static headers = ['Action', 'Logical ID', 'Physical ID', 'Resource Type'];

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
