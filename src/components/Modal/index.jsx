import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Modal as AntdModal } from 'antd';
import cs from 'classnames';
import { useSize } from 'ahooks';

import Icon from '@/components/Icon';

function Modal(props) {
  const eleRef = useRef();
  const size = useSize(eleRef.current);
  const [hasScroll, setHasScroll] = useState(false);

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
    <AntdModal
      wrapClassName={cs('ant-modal-custmoize', {
        'ant-modal-custmoize-no-shadow': !hasScroll,
      })}
      closeIcon={<Icon type="icon-Close-Circle-Fill" />}
      {...props}
    >
      <div ref={eleRef}>{props.children}</div>
    </AntdModal>
  );
}

Object.keys(AntdModal).forEach((key) => {
  Modal[key] = AntdModal[key];
});

export default Modal;
