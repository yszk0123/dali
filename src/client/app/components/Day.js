import React from 'react';
import formatDaliDate from '../../../shared/utils/formatDaliDate';

export default function Day({ date }) {
  const formattedDate = formatDaliDate(
    typeof date === 'string' ? new Date(date) : date,
  );

  return (
    <div>
      {formattedDate}
    </div>
  );
}
