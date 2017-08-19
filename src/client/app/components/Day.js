/* @flow */
import React from 'react';
import formatDaliDate from '../../../shared/utils/formatDaliDate';

type Props = {
  date: Date | string,
};

export default function Day({ date }: Props) {
  const formattedDate = formatDaliDate(
    typeof date === 'string' ? new Date(date) : date,
  );

  return (
    <div>
      {formattedDate}
    </div>
  );
}
