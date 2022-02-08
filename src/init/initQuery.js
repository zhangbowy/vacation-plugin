import qs from 'qs';
import config, { setConfig } from '@/config';

function initQuery() {
  const initQuerys = [
    {
      query: ['corpId', 'corpid'],
      key: 'corpId',
    },
  ];

  const split = window.location.href.split('?');
  let usrQuery = null;

  if (split[1]) {
    usrQuery = qs.parse(split[1]);
  }

  initQuerys.forEach((item) => {
    let value = config[item.key]

    if (usrQuery) {
      if (Array.isArray(item.query)) {
        item.query.find((key) => {
          if (usrQuery[key]) {
            value = usrQuery[key];
            return true;
          }
          return false;
        });
      } else if (usrQuery[item.query]) {
        value = usrQuery[item.query];
      }
    }

    if (value == null && item.defaultValue !== undefined) {
      value = item.defaultValue;
    }

    if (value != null) {
      setConfig({
        [item.key]: item.formatValue ? item.formatValue(value) : value,
      });
    }
  });
}

export default initQuery;
