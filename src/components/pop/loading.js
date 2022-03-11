import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Spin } from 'antd';

let el = null;
let storeFlag = '';
export const execHideLoading = (flag, changeCss) => {
  if (storeFlag && storeFlag !== flag) {
    return;
  }
  storeFlag = '';
  if (el) {
    const unmounted = unmountComponentAtNode(el);
    if (unmounted) {
      el.parentNode.removeChild(el);
      el = null;
      if (changeCss) {
        document.body.style.overflow = '';
      }
    }
  }
};
export const execShowLoading = (time, flag, changeCss, loadingTips, className) => {
  if (flag) {
    storeFlag = flag;
  }
  if (el) {
    return;
  }
  el = document.createElement('div');
  el.style = 'position: fixed; top: 0; right: 0;' +
  ' bottom: 0; left: 0;' +
  ' text-align: center; z-index: 99999;';
  document.body.appendChild(el);
  render(
    <Spin
      className={className}
      tip={loadingTips}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />,
    el
  );
  if (typeof time === 'number' && time >= 0) {
    setTimeout(flag => execHideLoading(flag, true), time);
  }
  if (changeCss) {
    document.body.style.overflow = 'hidden';
  }
};
export const showLoadingX = (time, flag, loadingTips, className) =>
  execShowLoading(time, flag, false, loadingTips, className);
export const hideLoadingX = flag => execHideLoading(flag, false);
export const inLoading = () => storeFlag !== '';
export const loading = {
  show: showLoadingX,
  hide: hideLoadingX,
  status: inLoading,
};

export default loading;
