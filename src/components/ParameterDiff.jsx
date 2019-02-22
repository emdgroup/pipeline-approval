import React from 'react';
import { diffWords } from 'diff';
import Table from './Table';

const headers = ['Parameter', 'Value'];

export default function ({ data }) {
  const filtered = data.filter(({ CurrentValue, NewValue }) => CurrentValue !== NewValue);

  if (!filtered.length) {
    return (<h2>No changes</h2>);
  }

  return (
    <Table headers={headers}>
      <tbody>
        {filtered.map(({ Name, Default, CurrentValue, NewValue }) => (
          <tr key={Name}>
            <td className="font-weight-bold">{Name}</td>
            <td className="diff w-auto">
              {diffWords(
                CurrentValue === null ? Default === null ? '' : Default : CurrentValue,
                NewValue === null ? '' : NewValue,
              ).map(({ added, removed, value }) => (
                <span className={added ? 'diff-add' : removed ? 'diff-remove' : 'diff-code-text'}>
                  {value}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
