import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { diffWords } from 'diff';
import Table from './Table';

const headers = ['Parameter', 'Value'];

export default function ({ data }) {
  return (
    <Table headers={headers}>
      <tbody>
        {data
          .filter(({ CurrentValue, NewValue }) => CurrentValue !== NewValue)
          .map(({ Name, Default, CurrentValue, NewValue }) => (
            <tr key={Name}>
              <td className="font-weight-bold">{Name}</td>
              <td className="diff">
                {diffWords(CurrentValue, NewValue).map(({ added, removed, value }) => (
                  <span className={added ? 'diff-add' : removed ? 'diff-remove' : 'diff-code-text'}>{value}</span>
                ))}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
