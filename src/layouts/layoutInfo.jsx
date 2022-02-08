import React from 'react';
import { InfoCircleFilled } from '@ant-design/icons';

import { DemoTabKeyMap } from '@/constant';

export const tablist = {
  '/level1/level2/demo': {
    tablist: [
      {
        tab: 'form-demo',
        key: DemoTabKeyMap.FORM,
      },
      {
        tab: 'table-demo',
        key: DemoTabKeyMap.TABLE,
      },
    ],
    tabBarExtraContent: '右侧拓展',
  },
};

export const breadcrumbs = {
  '/level1/level2/demo': [
    {
      breadcrumbName: '面包屑',
    },
    {
      path: '',
      breadcrumbName: 'demo页',
    },
  ],
};

export const titles = {
  '/level1/level2/demo': {
    title: '标题',
    tooltip:
      '标题-提示',
  },
};

export const headerExtra = {
  '/level1/level2/demo': {
    bottom: (
      <div className="d-flex align-items-center h-54 p-l-32 bg-#FFF8EB">
        <InfoCircleFilled className="c-#FF7A20" />
        <span className="m-l-8 fs-14 font-weight-600 c-000-85">
          底部拓展区域
        </span>
      </div>
    ),
  },
};

const getLayoutInfo = (pathname) => {
  const currentTablist = tablist[pathname];
  const currentBreadcrumbs = breadcrumbs[pathname];
  const currentTitle =
    typeof titles[pathname] === 'function' ? titles[pathname]() : titles[pathname] || '';
  const currentHeaderExtra = headerExtra[pathname] || {};

  return {
    currentTablist,
    currentBreadcrumbs,
    currentTitle,
    currentHeaderExtra,
  };
};

export default getLayoutInfo;
