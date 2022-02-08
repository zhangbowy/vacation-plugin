import { PageLoading } from '@ant-design/pro-layout';
import { useModel } from 'umi';

function SecurityLayout({ children }) {
  const { loading } = useModel('@@initialState');

  if (loading) {
    return PageLoading;
  }

  return children;
}

export default SecurityLayout;
