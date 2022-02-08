import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ModalForm as ProModalForm } from '@ant-design/pro-form';
import cs from 'classnames';
import { useSize } from 'ahooks';

function ModalForm(props) {
  const { className } = props;
  const eleRef = useRef();
  const size = useSize(eleRef.current);
  const [hasScroll, setHasScroll] = useState(false);

  const mergeClassName = cs(className, 'ant-modal-custmoize', {
    'ant-modal-custmoize-no-shadow': !hasScroll,
  });

  const calcScroll = useCallback((element) => {
    if (!element) return false;

    return element.scrollHeight > element.clientHeight;
  }, []);

  useEffect(() => {
    if (eleRef.current && props.visible) {
      const newHasScroll = calcScroll(eleRef.current?.parentElement);
      setHasScroll(newHasScroll);
    }
  }, [size, props.visible, calcScroll]);

  return (
    <ProModalForm {...props} className={mergeClassName}>
      <div ref={eleRef}>{props.children}</div>
    </ProModalForm>
  );
}

export default ModalForm;
