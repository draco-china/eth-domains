import { useModel } from 'umi';
import ProTable from '@ant-design/pro-table';

export default () => {
  const { getDomains } = useModel('useDomain');
  return (
    <ProTable<{
      domain: string;
      money: string;
    }>
      headerTitle="ETH域名列表"
      columns={[
        {
          title: '名字',
          dataIndex: 'domain',
          width: '15%',
          render: (text, record) =>
            record.money ? (
              <a
                target="_blank"
                href={`https://app.ens.domains/name/${text}.eth/register`}
              >
                {record.domain.toLowerCase()}
              </a>
            ) : (
              record.domain.toLowerCase()
            ),
        },
        {
          title: '费用',
          dataIndex: 'money',
          search: false,
          width: '30%',
        },
        {
          title: '到期时间',
          dataIndex: 'expirationDate',
          width: '30%',
          search: false,
        },
        {
          title: '类型',
          width: '10%',
          dataIndex: 'type',
          valueType: 'select',
          valueEnum: {
            string: { text: '字母' },
            number: { text: '数字' },
          },
          render: (_, record) =>
            isNaN(Number(record.domain)) ? '字母' : '数字',
        },
        {
          title: '长度',
          dataIndex: 'length',
          width: '10%',
          valueType: 'select',
          valueEnum: {
            3: '3位',
            4: '4位',
            5: '5位',
            6: '6位',
            7: '7位',
            8: '8位',
            9: '9位',
            10: '10位',
            11: '11位',
          },
          render: (_, record) => `${record.domain.length}位`,
        },
        {
          title: '是否注册',
          dataIndex: 'status',
          hideInTable: true,
          valueType: 'select',
          valueEnum: {
            available: { text: '可注册' },
            unavailable: { text: '不可注册' },
          },
        },

        {
          title: '操作',
          dataIndex: 'option',
          valueType: 'option',
          fixed: 'right',
          render: (text, record) =>
            record.money ? (
              <a
                target="_blank"
                href={`https://app.ens.domains/name/${record.domain.toLowerCase()}.eth/register`}
              >
                去注册
              </a>
            ) : (
              '已注册'
            ),
        },
      ]}
      rowKey="domain"
      request={getDomains}
      search={{
        filterType: 'light',
      }}
      size="small"
    />
  );
};
