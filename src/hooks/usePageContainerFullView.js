import { useState, useEffect } from 'react';

function usePageContainerFullView(ref) {
  const [minHeight, setMinHeight] = useState('');
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const eleTop = ref.current.getBoundingClientRect().top;
      const supportPageOffset = window.pageXOffset !== undefined;
      const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
      const y = supportPageOffset
        ? window.pageYOffset
        : isCSS1Compat
        ? document.documentElement.scrollTop
        : document.body.scrollTop;

      const newNumber = `100vh - ${eleTop}px - ${y}px - 24px`;
      setMinHeight(`calc(${newNumber}`);
      setNumber(newNumber);
    }
  }, [ref]);

  return [
    {
      minHeight,
    },
    {
      value: minHeight,
      number,
    },
  ];
}

export default usePageContainerFullView;
