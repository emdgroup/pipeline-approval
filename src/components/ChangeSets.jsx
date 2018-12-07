import React from 'react';
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

const Row = ({
  Replacement,
  Action,
  ResourceType,
  LogicalResourceId,
  PhysicalResourceId,
}) => {
  const action = Replacement === 'True' ? 'Replace' : Action;
  return (
    <tr>
      <td>
        <span className={`badge ${getBadge(action)}`}>{action}</span>
      </td>
      <td>{LogicalResourceId}</td>
      <td>{PhysicalResourceId || emptyValue}</td>
      <td>{ResourceType}</td>
    </tr>
  );
};

const headers = ['Action', 'Logical ID', 'Physical ID', 'Resource Type'];

export default function ({ set }) {
  return (
    <Table headers={headers}>
      <tbody>
        {set.map(({ ResourceChange }) => (
          <Row key={ResourceChange.LogicalResourceId} {...ResourceChange} />
        ))}
      </tbody>
    </Table>
  );
}
