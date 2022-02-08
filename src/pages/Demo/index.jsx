import React from 'react';

import { DemoTabKeyMap } from '@/constant';
import { useGlobalHeaderTab } from '@/hooks';
import FormDemo from './FormDemo';
import TableDemo from './TableDemo';

const Demo = () => {
  const [stateHeaderActiveKey] = useGlobalHeaderTab();

  const actionTabContentMap = {
    [DemoTabKeyMap.FORM]: <FormDemo />,
    [DemoTabKeyMap.TABLE]: <TableDemo />,
  };

  return actionTabContentMap[stateHeaderActiveKey] || null;
};

export default Demo;
