import React from 'react';
import { format } from 'date-fns';

export default function Day({ date }) {
  const formattedDate = format(date, 'YYYY-MM-DD');

  return (
    <div>
      {formattedDate}
    </div>
  );
}
