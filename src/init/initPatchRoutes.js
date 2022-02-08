/* eslint-disable global-require */
import { dynamic } from 'umi';
import { setConfig } from '@/config';
import LoadingComponent from '@/Loading';
import layout from '@/pages/_layout';
import { getRoleMap } from '@/services';
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
      name: '一级路由',
      exact: false,
      icon: 'icon-zichanguanli2',
      path: '/level1',
      component: layout,
      routes: [
        {
          name: '二级路由',
          exact: false,
          path: '/level1/level2',
          component: layout,
          routes: [
            {
              name: 'demo 示例',
              path: '/level1/level2/demo',
              component: dynamic({
                loader: () => import(/* webpackChunkName:  'demo' */ '@/pages/Demo/index'),
                loading: LoadingComponent,
              }),
            },
          ],
        },
      ],
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
  const [, roleIdMap = {}] = await getRoleMap();

  setConfig({
    roleIdMap,
  });

  oldRender();
}
