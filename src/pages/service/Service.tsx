import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProCoreActionType, ProSchema,ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import {Button, Dropdown, Image, Select, Space, Tag} from 'antd';
import {API} from '@/services/admin/typings';

import React, { useRef } from 'react';
import {createCategory, updateCategory, getAllCategory, removeCategory, getServicesByPaging} from '@/services/admin/api';

const isValidUrl = (url: string | undefined): boolean => {
    if ( url === undefined) {
        return false;
    }
    // 正则表达式来验证 URL
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
};

// render 方法
const renderImage = (
    dom: React.ReactNode,
    entity: API.Service,
    index: number,
    action: ProCoreActionType | undefined,
    schema: ProSchema<API.Service, any>
): React.ReactNode => {
    const imageUrl = entity.cover; // 假设 imageUrl 是 API.Service 中的字段
    return isValidUrl(imageUrl) ? (
        <Image
            width={100}
            src={imageUrl}
            preview={{ src: imageUrl }}
            alt={imageUrl}
        />
    ) : (
        <span>
        <small style={{color: 'red'}}>Invalid URL:{imageUrl} </small>
        </span>
    );
};

const renderContent = (
    dom: React.ReactNode,
    entity: API.Service,
    index: number,
    action: ProCoreActionType | undefined,
    schema: ProSchema<API.Service, any>
): React.ReactNode => {
    const content = entity.content; // 渲染 React 代码块
    try {
        const ReactElement = new Function('return ' + content)();
        return <ReactElement />;
    } catch (error) {
        console.error('Error rendering React component:', error);
        return <span style={{ color: 'red' }}>Invalid React component</span>;
    }
};


const renderRecommended = (
    dom: React.ReactNode,
    entity: API.Service,
    index: number,
    action: ProCoreActionType | undefined,
    schema: ProSchema<API.Service, any>
): React.ReactNode => {
    return (
        <Select defaultValue={entity.recommended ? 'true':'false'} style={{ width: 80 }} disabled>
            <Select.Option value="true">开启推荐</Select.Option>
            <Select.Option value="false">关闭推荐</Select.Option>
        </Select>
    )
};

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};


const columns: ProColumns<API.Service>[] = [
    {
        dataIndex: 'id',
        valueType: 'indexBorder',
        tooltip: '服务的 id',
        width: 48,
    },
    {
        title: '标题',
        dataIndex: 'name',
        valueType: 'text',
        copyable: true,
        ellipsis: true,
        tooltip: '展示给用户的标题',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },
    {
        title: '分类',
        dataIndex: 'category_name',
        valueType: 'text',
        tooltip: '项目分类，会按分类再显示服务',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                }
            ]
        }
    },
    {
        title: '简介',
        dataIndex: 'intro',
        valueType: 'text',
        tooltip: '简介，简短的介绍',
        hideInSearch: true,
    },
    {
        title: '封面',
        dataIndex: 'cover',
        valueType: 'text',
        tooltip: '展示在外部的界面',
        render: renderImage,
        hideInSearch: true,
    },
    {
        title: '内容',
        dataIndex: 'content',
        valueType:'textarea',
        tooltip: '展示的内容',
        //render: renderContent,
        hideInSearch: true,
    },
    {
        title: '服务时长',
        dataIndex: 'duration',
        tooltip: '服务的时长，时间单位为分钟',
        valueType:'digit'
    },
    {
        title: '定价',
        dataIndex: 'price',
        tooltip: '原始定价，打折之前的价格',
        valueType: 'money'
    },
    {
        title: '售价',
        dataIndex: 'amount',
        tooltip: '打折之后的价格，实际的价格',
        valueType:'money'
    },
    {
        title: '是否推荐',
        dataIndex: 'recommended',
        tooltip: '开启推荐会在首页或活动页面展示',
        valueType: 'select',
        valueEnum: {
            true: {text:'开启推荐',status:'success'},
            false: {text:'关闭推荐',status:'warning'},
        },
        render: renderRecommended,
    },
    {
        title: '创建时间',
        key: 'showTime',
        dataIndex: 'created_at',
        valueType: 'date',
        sorter: true,
        hideInSearch: true,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
    },
    {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    action?.startEditable?.(record.id);
                }}
            >
                编辑
            </a>,
            <TableDropdown
                key="actionGroup"
                onSelect={() => action?.reload()}
                menus={[
                    { key: 'copy', name: '复制' },
                    { key: 'delete', name: '删除' },
                ]}
            />,
        ],
    },
];

export default () => {
    const actionRef = useRef<ActionType>();
    return (
        <ProTable<API.Service>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                console.log(params, sort, filter);
                console.log("paging ","page:",params.current?.toString(),"pageSize:",params.pageSize?.toString());
                const ret = await getServicesByPaging(params);
                console.log("ret:",ret);
                return ret;
            }}
            editable={{
                type: 'multiple',
            }}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                defaultValue: {
                    option: { fixed: 'right', disable: true },
                },
                onChange(value) {
                    console.log('value: ', value);
                },
            }}
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            form={{
                // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 5,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="高级表格"
            toolBarRender={() => [
                <Button
                    key="button"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        actionRef.current?.reload();
                    }}
                    type="primary"
                >
                    新建
                </Button>,
            ]}
        />
    );
};