import { memo, useState, useCallback } from 'react'
import type { FC } from 'react'
import './RangeSelect.less'
import { Radio } from 'antd'
import { chooseDepartments } from '@xfw/rc-dingtalk-jsapi'
import Tooltip from '@/components/pop/Tooltip'

const { Group } = Radio

interface RangeSelectProps {
  value?: any
  onChange?: () => void
}

const RangeSelect: FC<RangeSelectProps> = ({ value, onChange }) => {
  console.log(value, onChange)
  const [test, setTest] = useState([])
  const chooseDepts = useCallback(
    () => {
      chooseDepartments({
        title: '选择部门',
        departments: test.map(({ id }) => id)
      }).then(({ departments }) => {
        setTest(departments)
      })
    },
    [test]
  )
  return <div className='com-auth--range-select'>
    <Group>
      <Radio value={'a'}>全公司</Radio>
      <Radio value={'b'}>所在部门及其下属部门</Radio>
      <Radio value={'c'}>
        <span className='com-auth--range-select--custom-text'>指定部门</span>
        {
          test && test.length > 0
            ? <>
              <Tooltip title={test.map(({ name }) => name).join('，')}>
                <span className='com-auth--range-select--custom-depts'>
                  {
                    `已选择${
                      test.slice(0, 2).map(({ name }) => name).join('，')
                    }${
                      test.length > 2 ? `等` : ''
                    }${test.length}个部门`
                  }
                </span>
              </Tooltip>
              <a
                className='com-auth--range-select--custom-link'
                onClick={chooseDepts}
              >
                重选
              </a>
            </>
            : <a
              className='com-auth--range-select--custom-link'
              onClick={chooseDepts}
            >
              选择部门
            </a>
        }
      </Radio>
    </Group>
  </div>
}

export default memo(RangeSelect)
