import React from 'react';
import VerticalLineWithTitle from '../VerticalLineWithTitle';

function Section(props) {
  const { title, children } = props;
  return (
    <div className="p-24">
      <VerticalLineWithTitle title={title} />
      <div className="m-t-24">{children}</div>
    </div>
  );
}

export default Section;
