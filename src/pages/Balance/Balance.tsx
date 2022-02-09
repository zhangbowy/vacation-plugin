import { memo } from 'react';
import type { FC } from 'react';
import PageContent from '@/components/structure/PageContent'
import ContentFooter from '@/components/structure/ContentFooter'
import { Input, Select, Button } from 'antd'
// import { useSelector } from 'dva'
import Header from './components/Header'
import './Balance.less';

const Balance: FC = () => {
  // const sel = useSelector(state => state)
  // console.log(sel)
  return <PageContent className='pg-balance' hasPadding>
    <Header />
    <div>
      <div>
        <Input placeholder='搜索人员姓名' /><Select placeholder='选择部门' /><Select placeholder='选择在职情况' />
      </div>
      <div>
        <Button>使用Excel批量修改</Button>
        <Button>导出</Button>
      </div>
    </div>
    <ContentFooter>footer</ContentFooter>
  </PageContent>;
};

export default memo(Balance);
