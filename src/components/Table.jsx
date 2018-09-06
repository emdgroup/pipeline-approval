import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Table = ({ headers, data, renderData, render }) => {
  const isArrayEmpty = array => Array.isArray(array) && array.every(isArrayEmpty);

  const renderHeaders = header => (
    <th className="border-top-0" key={header}>
      {header}
    </th>
  );
  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table table-striped table-assumerole">
          <thead>
            <tr>{headers.map(renderHeaders)}</tr>
          </thead>
          <tbody>
            {render && (data && !isArrayEmpty(data)) ? (
              data.map(renderData)
            ) : (
              <tr className="empty-collection text-center">
                <td colSpan="8">
                  {render && (data && isArrayEmpty(data)) ? (
                    <div className="empty-collection">No data found</div>
                  ) : null}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
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
