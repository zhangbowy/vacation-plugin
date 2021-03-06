import moment from 'moment';
import initQuery from '@/init/initQuery';

moment.locale('cn', {
  week: {
    dow: 0,
  },
});

import './style/auto.css';
import '@/style/index.less';

initQuery();

export { default as getInitialState, initialStateConfig } from '@/init/initialState';
export { default as rootContainer } from '@/init/rootContainer';
export { default as patchRoutes, render } from '@/init/initPatchRoutes';
export { requestConfig as request } from '@/utils/request';
