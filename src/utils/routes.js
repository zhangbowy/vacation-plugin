import { history } from 'umi';

export function goX(inventoryId) {
  history.push({
    pathname: '/xx/x',
    search: `?inventoryId=${inventoryId}`,
  });
}

