import { Spin } from 'antd';
import config from '@/config';

async function getInitialState() {
  return {
    ...config,
    user: {
      avatar: '',
      name: '马以闪',
      isAdmin: true,
    },
    roles: {},
  };
}

export const initialStateConfig = {
  loading: (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Spin size="large" />
    </div>
  ),
};

export default getInitialState;
