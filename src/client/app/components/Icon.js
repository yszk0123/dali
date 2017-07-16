import React from 'react';

export default function IconButton({ icon, ...rest }) {
  return <i className={`fa fa-${icon}`} {...rest} />;
}
