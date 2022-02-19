import { memo, useCallback, useMemo } from 'react'
import type { FC } from 'react'
import './RangeSelect.less'
import Radio, { Group } from '@/components/form/Radio'
import { chooseDepartments } from '@xfw/rc-dingtalk-jsapi'
import Tooltip from '@/components/pop/Tooltip'

interface RangeValueType {
  depts?: [],
  dataAuthority?: number
}

interface RangeSelectProps {
  value?: RangeValueType
  onChange?: (x: RangeValueType) => void
}

const RangeSelect: FC<RangeSelectProps> = ({ value, onChange }) => {
  const { depts, dataAuthority } = useMemo(
    () => {
      if (value) {
        return {
          depts: value.depts || [],
          dataAuthority: value.dataAuthority
        }
      }
      return {
        depts: [], dataAuthority: null
      }
    },
    [value]
  )
  console.log(value, onChange)
  const chooseDepts = useCallback(
    () => {
      chooseDepartments({
        title: '选择部门',
        departments: (value && value.depts || []).map(({ id }) => id)
      }).then(({ departments }) => {
        if (onChange) {
          onChange({
            depts: departments,
            dataAuthority: 2
          })
        }
      })
    },
    [value, onChange]
  )
  const handleChangeDataAuthority = useCallback(
    ({ target }) => {
      if (onChange) {
        onChange({
          depts: value && value.depts ? value.depts : [],
          dataAuthority: target.value
        })
      }
    },
    [value, onChange]
  )
  return <div className='com-auth--range-select'>
    <Group value={dataAuthority} onChange={handleChangeDataAuthority}>
      <Radio value={0}>全公司</Radio>
      <Radio value={1}>所在部门及其下属部门</Radio>
      <Radio value={2}>
        <span className='com-auth--range-select--custom-text'>指定部门</span>
        {
          depts && depts.length > 0
            ? <>
              <Tooltip title={depts.map(({ name }) => name).join('，')}>
                <span className='com-auth--range-select--custom-depts'>
                  { `已选择${depts.length}个部门` }
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
