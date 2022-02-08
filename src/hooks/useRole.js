import { useRef, useMemo } from 'react';
import config from '@/config';

export default function useRole(roleKey) {
  const { roleIdMap } = config;
  const roleMapRef = useRef({});

  roleMapRef.current = useMemo(() => {
    const roleMap = {};
    function hasRole(key) {
      return !!roleIdMap?.[key];
    }

    if (Array.isArray(roleKey)) {
      roleKey.forEach((key) => {
        roleMap[key] = hasRole(key);
      });
    } else {
      roleMap[roleKey] = hasRole(roleKey);
    }

    return roleMap;
  }, [roleIdMap, roleKey]);

  return [roleMapRef.current];
}
