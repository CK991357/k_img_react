import { UploadOutlined } from '@ant-design/icons'; // 导入 Ant Design 图标
import { Button, Input, message, Space, Upload } from 'antd'; // 导入 Ant Design 组件
import { useState } from 'react';
import { uploadImage } from '../api'; // 导入 API 函数

const { useMessage } = message; // 解构 message

/**
 * UploadSection 组件：处理图片上传功能
 * @param {object} props - 组件属性
 * @param {function} props.onUploadSuccess - 图片上传成功后的回调函数
 * @returns {JSX.Element} - 上传图片部分的 JSX 元素
 */
function UploadSection({ onUploadSuccess }) {
  const [messageApi, contextHolder] = useMessage(); // 获取 messageApi 和 contextHolder
  const [imageFile, setImageFile] = useState(null);
  const [uploadFolder, setUploadFolder] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState([]); // 新增 fileList 状态

  /**
   * 处理文件选择器的变更事件
   * @param {object} info - Upload 组件的事件信息对象
   * @returns {boolean} - 返回 false 阻止 Upload 自动上传
   */
  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 只保留最新上传的文件
    setFileList(newFileList); // 更新 fileList 状态

    // 只要有文件在列表中，就设置 imageFile
    if (newFileList.length > 0) {
      setImageFile(newFileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
    return false; // 阻止 Upload 组件自动上传
  };

  /**
   * 处理上传操作
   * @returns {Promise<void>}
   */
  const handleUpload = async () => {
    if (!imageFile) {
      messageApi.error('请选择一个图片文件。'); // 使用 messageApi
      return;
    }

    setIsUploading(true);
    messageApi.loading('正在上传...', 0); // 使用 messageApi 显示加载提示

    try {
      const tagsArray = uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      // 如果用户没有输入文件夹，则默认使用 'worker_uploads'
      const targetFolder = uploadFolder.trim() === '' ? 'worker_uploads' : uploadFolder;
      const result = await uploadImage(imageFile, targetFolder, tagsArray);

      messageApi.destroy(); // 使用 messageApi 关闭加载提示
      messageApi.success(`上传成功！Public ID: ${result.public_id}`); // 使用 messageApi 显示成功提示
      // 调用父组件传入的成功回调，通知图片已上传
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      // 清空表单和文件列表
      setImageFile(null);
      setUploadFolder('');
      setUploadTags('');
      setFileList([]); // 清空文件列表
    } catch (error) {
      messageApi.destroy(); // 使用 messageApi 关闭加载提示
      messageApi.error(`上传失败: ${error.message}`); // 使用 messageApi 显示错误提示
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section style={{ marginBottom: '20px' }}>
      {contextHolder} {/* 渲染 contextHolder */}
      <h2>上传图片</h2>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Upload
          beforeUpload={handleFileChange} // 使用自定义的 handleFileChange
          fileList={fileList} // 绑定 fileList 状态
          onChange={handleFileChange} // 添加 onChange 事件来更新 fileList
          showUploadList={true} // 显示已选择的文件列表
          maxCount={1} // 限制只能选择一个文件
          disabled={isUploading} // 仅在上传中禁用
          onRemove={() => { // 允许用户移除文件
            setImageFile(null);
            setFileList([]);
          }}
        >
          <Button icon={<UploadOutlined />} disabled={isUploading}>选择图片</Button>
        </Upload>
        <Input
          placeholder="上传到文件夹 (可选): 例如: my_new_folder"
          value={uploadFolder}
          onChange={(e) => setUploadFolder(e.target.value)}
          disabled={isUploading}
        />
        <Input
          placeholder="添加标签 (可选, 逗号分隔): 例如: nature, landscape"
          value={uploadTags}
          onChange={(e) => setUploadTags(e.target.value)}
          disabled={isUploading}
        />
        <Button
          type="primary"
          onClick={handleUpload}
          loading={isUploading}
          disabled={isUploading} // 仅在上传中禁用，保持一直可用
        >
          {isUploading ? '上传中...' : '上传'}
        </Button>
      </Space>
    </section>
  );
}

export default UploadSection;
