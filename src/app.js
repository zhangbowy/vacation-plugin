import initQuery from '@/init/initQuery';
import initDingTalkJsapi from '@/init/initDingTalkJsapi';

import './style/auto.css';
import '@/style/index.less';

initQuery();
initDingTalkJsapi();

export { default as getInitialState, initialStateConfig } from '@/init/initialState';
export { default as rootContainer } from '@/init/rootContainer';
export { default as patchRoutes, render } from '@/init/initPatchRoutes';
export { requestConfig as request } from '@/utils/request';
