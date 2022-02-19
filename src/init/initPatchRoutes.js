/* eslint-disable global-require */
import { dynamic } from 'umi';
// import { setConfig } from '@/config';
import LoadingComponent from '@/Loading';
// import layout from '@/pages/_layout';
// import { getRoleMap } from '@/services';
import { recursionFormatData, recursionCollectionData } from '@/utils/utils';

let roleIdMap = {};

function filterRoleMenu(menu) {
  return recursionFormatData(menu, 'routes', {
    isRemove(route) {
      // 如果不存在 子路由 则移除当前路由
      if (route.routes) {
        return !route.routes.length;
      }

      // 如果当前路由资源的 id 不在后台配置的列表中， 则移除当前路由
      return route.id ? !roleIdMap[route.id] : false;
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

export default function patchRoutes({ routes }) {
  const oldRoutes = routes[0].routes[0].routes[0].routes;

  const otherRoutes = [
    {
      component: dynamic({
        loader: () => import(/* webpackChunkName: '404' */ '@/pages/404'),
        loading: LoadingComponent,
      }),
    },
  ];

  const addRoutes = [
    {
      path: '/balance',
      name: '假期余额',
      icon: 'icon-zichanguanli2',
      exact: true,
      component: dynamic({
        loader: () => import('@/pages/Balance'),
        loading: LoadingComponent,
      }),
      routes: [
        { path: '/balance' },
        { path: '/batch-edit' }
      ]
    },
    {
      path: '/balance/batch-edit',
      name: '假期余额批量修改',
      icon: 'icon-zichanguanli2',
      hideInMenu: true,
      component: dynamic({
        loader: () => import('@/pages/BalanceBatchEdit'),
        loading: LoadingComponent,
      })
    },
    {
      path: '/statistics',
      name: '统计报表',
      icon: 'icon-zichanguanli2',
      component: dynamic({
        loader: () => import('@/pages/Statistics'),
        loading: LoadingComponent,
      }),
    },
    {
      path: '/overview',
      name: '休假总览',
      icon: 'icon-zichanguanli2',
      component: dynamic({
        loader: () => import('@/pages/Overview'),
        loading: LoadingComponent,
      }),
    },
    {
      path: '/auth',
      name: '权限设置',
      icon: 'icon-zichanguanli2',
      component: dynamic({
        loader: () => import('@/pages/Auth'),
        loading: LoadingComponent,
      }),
    },
    {
      path: '/log',
      name: '操作日志',
      icon: 'icon-zichanguanli2',
      component: dynamic({
        loader: () => import('@/pages/Log'),
        loading: LoadingComponent,
      }),
    },
    ...otherRoutes,
  ];

  // 过滤没有权限的页面
  const filterAddRoutesByRole = filterRoleMenu(addRoutes);

  // 默认展示第一个子路由
  const redirectPath = recursionCollectionData(filterAddRoutesByRole, 'routes', {
    addCondition(data) {
      return !data?.routes?.length;
    },
    stop: ($1, values) => {
      return values.length === 1;
    },
  });

  const mergeRoutes = [
    {
      path: '/',
      redirect: redirectPath?.[0]?.path,
      exact: true,
    },
    ...oldRoutes,
    ...filterRoleMenu(addRoutes),
  ];

  routes[0].routes[0].routes[0].routes = addRouteLevel(mergeRoutes);
}

// eslint-disable-next-line consistent-return
export async function render(oldRender) {
  // const [, roleIdMap = {}] = await getRoleMap();

  // setConfig({
  //   roleIdMap,
  // });

  oldRender();
}
