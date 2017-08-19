import * as React from 'react';
import formatDaliDate from '../../../shared/utils/formatDaliDate';

interface Props {
  date: Date | string;
}

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
