import React from 'react';
import { Upload, Button, Table, Popconfirm, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import {createCategory, updateCategory, getAllCategory, removeCategory, getStaticFiles} from '@/services/admin/api';

const { Dragger } = Upload;

const FileManager = () => {
    const [fileList, setFileList] = React.useState([]);

    // Handle file upload
    const handleUpload = async (file) => {
        // const formData = new FormData();
        // formData.append('file', file);
        //
        // try {
        //     await axios.post('/upload', formData);
        //     message.success('File uploaded successfully');
        //     fetchFileList();
        // } catch (err) {
        //     message.error('Upload failed');
        // }
    };

    // Fetch file list from the server
    const fetchFileList = async () => {
        const files = await getStaticFiles()
        if (files && files.length > 0) {
            setFileList(files)
        }

        // try {
        //     const response = await axios.get('/files');
        //     setFileList(response.data);
        // } catch (err) {
        //     message.error('Failed to fetch file list');
        // }
    };

    // Delete file
    const handleDelete = async (fileId) => {
        // try {
        //     await axios.delete(`/files/${fileId}`);
        //     message.success('File deleted successfully');
        //     fetchFileList();
        // } catch (err) {
        //     message.error('Delete failed');
        // }
    };

    React.useEffect(() => {
        fetchFileList();
    }, []);

    const columns = [
        {
            title: '文件名',
            dataIndex: 'name',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure to delete this file?"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Dragger
                customRequest={({ file, onSuccess }) => {
                    handleUpload(file);
                    //onSuccess();
                }}
                multiple={false}
            >
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
            <Table dataSource={fileList} columns={columns} rowKey="id" />
        </div>
    );
};

export default FileManager;
