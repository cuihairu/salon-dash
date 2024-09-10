import React from 'react';
import {Upload, Button, Table, Popconfirm, message, Pagination} from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { updateStaticFile,  deleteStaticFile, getStaticFiles} from '@/services/admin/api';
import {API} from "@/services/admin/typings";

const { Dragger } = Upload;

const FileManager = () => {
    const [fileList, setFileList] = React.useState<API.FileWithPermissions[]>([]);
    const [total, setTotal] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(2);
    // Handle file upload
    const handleUpload = async (file:string|Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        updateStaticFile(formData).then(fetchFileList)
    };

    // Fetch file list from the server
    const fetchFileList = async () => {
        const ret = await getStaticFiles({current:currentPage,pageSize:pageSize})
        if (ret && ret.data?.length >= 0 && ret.total != undefined && ret.total >= 0) {
            setFileList(ret.data)
            setTotal(ret.total)
            setCurrentPage(currentPage)
            setPageSize(pageSize)
        }
    };

    // Delete file
    const handleDelete = async (filename :string) => {
        deleteStaticFile(filename).then(fetchFileList);
    };

    React.useEffect(() => {
        fetchFileList();
    }, []);

    const columns = [
        {
            title: '文件名',
            dataIndex: 'filename',
        },
        {
            title: '权限',
            dataIndex: 'perm',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            valueType: 'url',
            render: (text: string, record: any) => {
                return (
                    <a href={text} target="_blank" rel="noopener noreferrer">
                        {text || 'N/A'}  {/* 如果 URL 不存在，显示 'N/A' */}
                    </a>
                );
            }
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text: string, record: any) => (
                <Popconfirm
                    title="确定要删除这个文件吗?"
                    onConfirm={() => handleDelete(record.filename)}
                >
                    <Button icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Dragger
                customRequest={({ file , onSuccess }) => {
                    handleUpload(file);
                    if (onSuccess){
                        onSuccess(()=>{
                            fetchFileList();
                        });
                    }
                }}
                multiple={false}
            >
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或者将文件拖入这里开始上传</p>
            </Dragger>
            <Table dataSource={fileList} columns={columns} rowKey="filename" pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                onChange: async (page, pageSize) => {
                    const ret = await getStaticFiles({current: page, pageSize: pageSize});
                    if (ret && ret.data?.length > 0 && ret.total!== undefined && ret.total > 0) {
                        setTotal(ret.total)
                        setCurrentPage(page)
                        setPageSize(pageSize)
                        setFileList(ret.data)
                    }
                }
            }}/>
        </div>
    );
};

export default FileManager;
