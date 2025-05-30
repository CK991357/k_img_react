import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Space, Typography, Upload } from 'antd';
import { useState } from 'react';
import { uploadImage } from '../api';

const { Text } = Typography;

/**
 * UploadSection 组件：处理图片上传功能
 * @param {object} props - 组件属性
 * @param {function} props.onUploadSuccess - 图片上传成功后的回调函数
 * @returns {JSX.Element} - 上传图片部分的 JSX 元素
 */
function UploadSection({ onUploadSuccess }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [uploadFolder, setUploadFolder] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  /**
   * 处理文件选择器的变更事件
   * @param {object} info - Upload 组件的事件信息对象
   * @returns {boolean} - 返回 false 阻止 Upload 自动上传
   */
  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);

    if (newFileList.length > 0) {
      setImageFile(newFileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
    return false;
  };

  /**
   * 处理上传操作
   * @returns {Promise<void>}
   */
  const handleUpload = async () => {
    if (!imageFile) {
      messageApi.error('请选择一个图片文件。');
      return;
    }

    setIsUploading(true);
    messageApi.loading('正在上传...', 0);

    try {
      const tagsArray = uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      const targetFolder = uploadFolder.trim() === '' ? 'worker_uploads' : uploadFolder;
      const result = await uploadImage(imageFile, targetFolder, tagsArray);

      messageApi.destroy();
      messageApi.success(`上传成功！Public ID: ${result.public_id}`);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      setImageFile(null);
      setUploadFolder('');
      setUploadTags('');
      setFileList([]);
    } catch (error) {
      messageApi.destroy();
      messageApi.error(`上传失败: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="animated-section" style={{ 
      marginBottom: '20px',
      border: '1px dashed #c4b5fd',
      background: 'rgba(199, 210, 254, 0.1)'
    }}>
      {contextHolder}
      <h2>上传图片</h2>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Upload
          beforeUpload={handleFileChange}
          fileList={fileList}
          onChange={handleFileChange}
          showUploadList={true}
          maxCount={1}
          disabled={isUploading}
          onRemove={() => {
            setImageFile(null);
            setFileList([]);
          }}
        >
          <Button 
            icon={<UploadOutlined />} 
            disabled={isUploading}
            style={{ 
              background: '#f5f3ff',
              borderColor: '#8b5cf6',
              color: '#7e22ce'
            }}
          >
            选择图片
          </Button>
        </Upload>
        
        {fileList.length > 0 && (
          <Text strong style={{ color: '#7e22ce' }}>
            已选择: {fileList[0].name}
          </Text>
        )}
        
        <Input
          placeholder="上传到文件夹 (可选): 例如: my_new_folder"
          value={uploadFolder}
          onChange={(e) => setUploadFolder(e.target.value)}
          disabled={isUploading}
          prefix={<span style={{ color: '#7e22ce' }}>📁</span>}
          style={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#334155' }}
        />
        
        <Input
          placeholder="添加标签 (可选, 逗号分隔): 例如: nature, landscape"
          value={uploadTags}
          onChange={(e) => setUploadTags(e.target.value)}
          disabled={isUploading}
          prefix={<span style={{ color: '#7e22ce' }}>🏷️</span>}
          style={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#334155' }}
        />
        
        <Button
          type="primary"
          onClick={handleUpload}
          loading={isUploading}
          icon={<CloudUploadOutlined />}
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #7e22ce)',
            border: 'none',
            height: 40,
            fontWeight: 600
          }}
        >
          {isUploading ? '上传中...' : '开始上传'}
        </Button>
      </Space>
    </section>
  );
}

export default UploadSection;
