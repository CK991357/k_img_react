import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Space, Upload } from 'antd';
import { useState } from 'react';
import { uploadImage } from '../api';

const { useMessage } = message;

/**
 * UploadSection 组件：处理图片上传功能
 * @param {object} props - 组件属性
 * @param {function} props.onUploadSuccess - 图片上传成功后的回调函数
 * @returns {JSX.Element} - 上传图片部分的 JSX 元素
 */
function UploadSection({ onUploadSuccess }) {
  const [messageApi, contextHolder] = useMessage();
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
    <section style={{ marginBottom: '24px' }}>
      {contextHolder}
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
          <path d="M7 10V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V10M12 14V21M8 21H16M3 15H21" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        上传图片
      </h2>
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
          <Button icon={<UploadOutlined />} disabled={isUploading}>选择图片</Button>
        </Upload>
        <Input
          prefix={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="#8b5cf6" strokeWidth="2"/>
              <path d="M8 12H16" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8V16" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
          placeholder="上传到文件夹 (可选): 例如: my_new_folder"
          value={uploadFolder}
          onChange={(e) => setUploadFolder(e.target.value)}
          disabled={isUploading}
        />
        <Input
          prefix={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path d="M7 7H17M7 11H13M7 15H17M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke="#8b5cf6" strokeWidth="2"/>
            </svg>
          }
          placeholder="添加标签 (可选, 逗号分隔): 例如: nature, landscape"
          value={uploadTags}
          onChange={(e) => setUploadTags(e.target.value)}
          disabled={isUploading}
        />
        <Button
          type="primary"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 12V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V12M12 3V15M12 15L8.5 11.5M12 15L15.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          onClick={handleUpload}
          loading={isUploading}
          disabled={isUploading}
        >
          {isUploading ? '上传中...' : '上传'}
        </Button>
      </Space>
    </section>
  );
}

export default UploadSection;
