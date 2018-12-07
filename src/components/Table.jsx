import React from 'react';
import PropTypes from 'prop-types';

const Table = ({ headers, children }) => {
  const isArrayEmpty = array => Array.isArray(array) && array.every(isArrayEmpty);

  const renderHeaders = (header) => (
    <th className="border-top-0" key={header}>
      {header}
    </th>
  );
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>{headers.map(renderHeaders)}</tr>
        </thead>
        {children}
      </table>
    </div>
  );
};

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  renderData: PropTypes.func,
  render: PropTypes.bool,
};

Table.defaultProps = {
  headers: null,
  data: [],
  renderData: () => {},
  render: false,
};

export default Table;
