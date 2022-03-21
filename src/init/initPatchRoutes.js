/* eslint-disable global-require */
import { dynamic } from 'umi';
// import { setConfig } from '@/config';
import LoadingComponent from '@/Loading';
// import layout from '@/pages/_layout';
// import { getRoleMap } from '@/services';
import { recursionFormatData } from '@/utils/utils';
import initDingTalkJsapi from '@/init/initDingTalkJsapi';
import checkAuth from '@/utils/checkAuth';
import config from '@/config';

function filterRoleMenu(menu) {
  return recursionFormatData(menu, 'routes', {
    isRemove(route) {
      // 如果不存在 子路由 则移除当前路由
      // if (route.routes) {
      //   return !route.routes.length;
      // }

      // 如果当前路由资源的 id 不在后台配置的列表中， 则移除当前路由
      if (route.permissionId) {
        return !checkAuth(route.permissionId);
      }
      return false;
    },
  });
}

function addRouteLevel(menu) {
  return recursionFormatData(menu || [], 'routes', {
    format(v, level) {
      v.level = level;
    },
  });
}

export const addRoutes = [
  {
    path: '/rules',
    name: '假期规则',
    icon: 'icon-jiaqiguize',
    exact: true,
    component: dynamic({
      loader: () => import('@/pages/Rules'),
      loading: LoadingComponent,
    }),
    permissionId: 1001,
  },
  {
    path: '/balance',
    name: '假期余额',
    icon: 'icon-jiaqiyue',
    exact: true,
    component: dynamic({
      loader: () => import('@/pages/Balance'),
      loading: LoadingComponent,
    }),
    routes: [],
    permissionId: 2001,
  },
  {
    path: '/balance/batch-edit',
    name: '假期余额批量修改',
    icon: 'icon-zichanguanli2',
    hideInMenu: true,
    component: dynamic({
      loader: () => import('@/pages/BalanceBatchEdit'),
      loading: LoadingComponent,
    }),
  },
  {
    path: '/statistics',
    name: '统计报表',
    icon: 'icon-tongjibaobiao1',
    component: dynamic({
      loader: () => import('@/pages/Statistics'),
      loading: LoadingComponent,
    }),
    permissionId: 3001,
  },
  {
    path: '/overview',
    name: '休假总览',
    icon: 'icon-xiujiazonglan',
    component: dynamic({
      loader: () => import('@/pages/Overview'),
      loading: LoadingComponent,
    }),
    permissionId: 4001,
  },
  {
    path: '/auth',
    name: '权限设置',
    icon: 'icon-quanxianshezhi',
    component: dynamic({
      loader: () => import('@/pages/Auth'),
      loading: LoadingComponent,
    }),
    permissionId: 6001,
  },
  {
    path: '/log',
    name: '操作日志',
    icon: 'icon-caozuorizhi',
    component: dynamic({
      loader: () => import('@/pages/Log'),
      loading: LoadingComponent,
    }),
    permissionId: 7001,
  },
  {
    path: '/main',
    name: '假期管理',
    hideInMenu: true,
    component: dynamic({
      loader: () => import('@/pages/Main'),
      loading: LoadingComponent,
    }),
  }
];

export default function patchRoutes({ routes }) {
  const oldRoutes = routes[0].routes[0].routes[0].routes;
  const otherRoutes = [
    {
      component: dynamic({
        loader: () => import(/* webpackChunkName: '404' */ '@/pages/notFound/404'),
        loading: LoadingComponent,
      }),
    },
  ];

  const allRoutes = [
    ...addRoutes,
    ...otherRoutes,
  ];

  // 过滤没有权限的页面
  const filterAddRoutesByRole = filterRoleMenu(allRoutes);
  const fistPage = config.code
    ? '/main'
    : filterAddRoutesByRole.find((item) => !item.hideInMenu);
  const mergeRoutes = [
    {
      path: '/(index.html)?',
      redirect: fistPage?.path || '/404',
      exact: true,
    },
    ...oldRoutes,
    ...filterRoleMenu(allRoutes),
  ];
  routes[0].routes[0].routes[0].routes = addRouteLevel(mergeRoutes);
}

export async function render(oldRender) {
  await initDingTalkJsapi();
  oldRender();
}
