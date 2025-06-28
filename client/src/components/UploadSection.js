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
  const [selectedFiles, setSelectedFiles] = useState([]); // 存储选择的文件列表
  const [uploadFolder, setUploadFolder] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState([]); // Ant Design Upload 组件的文件列表
  const [uploadedCount, setUploadedCount] = useState(0); // 已上传文件数量
  const [totalFiles, setTotalFiles] = useState(0); // 总文件数量
  const [uploadErrors, setUploadErrors] = useState([]); // 存储上传失败的文件信息

  /**
   * 处理文件选择器的变更事件
   * @param {object} info - Upload 组件的事件信息对象
   * @returns {boolean} - 返回 false 阻止 Upload 自动上传
   */
  const handleFileChange = (info) => {
    // 更新 Ant Design Upload 组件的文件列表
    setFileList(info.fileList);

    // 提取原始文件对象并存储到 selectedFiles 状态中
    const newSelectedFiles = info.fileList.map(file => file.originFileObj).filter(Boolean);
    setSelectedFiles(newSelectedFiles);

    // 重置上传状态和错误信息
    setUploadErrors([]);
    setUploadedCount(0);
    setTotalFiles(newSelectedFiles.length);
    return false; // 阻止 Ant Design Upload 自动上传
  };

  /**
   * 处理单个文件上传操作
   * @returns {Promise<void>}
   */
  const handleSingleUpload = async () => {
    if (selectedFiles.length !== 1) {
      messageApi.error('请选择一个图片文件进行上传。');
      return;
    }

    setIsUploading(true);
    messageApi.loading('正在上传单个文件...', 0);

    try {
      const tagsArray = uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      const targetFolder = uploadFolder.trim() === '' ? 'worker_uploads' : uploadFolder;
      const result = await uploadImage(selectedFiles[0], targetFolder, tagsArray);

      messageApi.destroy();
      messageApi.success(`单个文件上传成功！Public ID: ${result.public_id}`);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      // 清理状态
      setSelectedFiles([]);
      setUploadFolder('');
      setUploadTags('');
      setFileList([]);
      setUploadedCount(0);
      setTotalFiles(0);
    } catch (error) {
      messageApi.destroy();
      messageApi.error(`单个文件上传失败: ${error.message}`);
      setUploadErrors([{ fileName: selectedFiles[0]?.name || '未知文件', error: error.message }]);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 处理批量文件上传操作
   * @returns {Promise<void>}
   */
  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      messageApi.error('请选择至少一个图片文件进行批量上传。');
      return;
    }

    setIsUploading(true);
    setUploadedCount(0);
    setTotalFiles(selectedFiles.length);
    setUploadErrors([]);
    // 使用一个明确的key，并设置duration为0，表示需要手动关闭
    messageApi.open({
      key: 'bulk-upload-loading',
      type: 'loading',
      content: `正在批量上传 ${selectedFiles.length} 个文件...`,
      duration: 0,
    });

    const tagsArray = uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const targetFolder = uploadFolder.trim() === '' ? 'worker_uploads' : uploadFolder;

    const uploadPromises = selectedFiles.map(async (file, index) => {
      try {
        const result = await uploadImage(file, targetFolder, tagsArray);
        setUploadedCount(prev => prev + 1);
        // 更新加载提示的进度
        messageApi.open({
          key: 'bulk-upload-loading',
          type: 'loading',
          content: `正在上传... (${index + 1}/${selectedFiles.length})`,
          duration: 0, // 保持duration为0，直到所有上传完成
        });
        return { status: 'fulfilled', value: result };
      } catch (error) {
        setUploadErrors(prev => [...prev, { fileName: file?.name || `文件 ${index + 1}`, error: error.message }]);
        return { status: 'rejected', reason: error };
      }
    });

    await Promise.allSettled(uploadPromises);

    // 所有上传完成后，销毁加载提示
    messageApi.destroy('bulk-upload-loading');
    setIsUploading(false);

    // 根据上传结果显示最终提示，duration设置为默认值以便自动消失
    if (uploadErrors.length === 0) {
      messageApi.success('所有文件批量上传成功！', 3); // 3秒后自动消失
    } else if (uploadErrors.length === selectedFiles.length) {
      messageApi.error('所有文件批量上传失败！', 5); // 5秒后自动消失
    } else {
      messageApi.warning(`部分文件上传成功，${uploadErrors.length} 个文件上传失败。`, 5); // 5秒后自动消失
    }

    if (onUploadSuccess) {
      onUploadSuccess();
    }
    // 清理状态
    setSelectedFiles([]);
    setUploadFolder('');
    setUploadTags('');
    setFileList([]);
    setUploadedCount(0);
    setTotalFiles(0);
  };

  return (
    <section style={{ marginBottom: '24px' }}>
      {contextHolder}
      <h2 className="section-title-gradient">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
          <path d="M7 10V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V10M12 14V21M8 21H16M3 15H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        上传图片
      </h2>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Upload
          beforeUpload={handleFileChange}
          fileList={fileList}
          onChange={handleFileChange}
          showUploadList={true}
          multiple={true} // 允许选择多个文件
          disabled={isUploading}
          onRemove={(file) => {
            const newFileList = fileList.filter(item => item.uid !== file.uid);
            setFileList(newFileList);
            setSelectedFiles(newFileList.map(item => item.originFileObj).filter(Boolean));
            setTotalFiles(newFileList.length);
            return true;
          }}
        >
          <Button icon={<UploadOutlined />} disabled={isUploading}>选择图片</Button>
        </Upload>
        <Input
          prefix={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="var(--link-accent-color)" strokeWidth="2"/>
              <path d="M8 12H16" stroke="var(--link-accent-color)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8V16" stroke="var(--link-accent-color)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
          placeholder="上传到文件夹 (可选): 例如: my_new_folder"
          value={uploadFolder}
          onChange={(e) => setUploadFolder(e.target.value)}
          disabled={isUploading}
          style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
        />
        <Input
          prefix={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
              <path d="M7 7H17M7 11H13M7 15H17M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke="var(--link-accent-color)" strokeWidth="2"/>
            </svg>
          }
          placeholder="添加标签 (可选, 逗号分隔): 例如: nature, landscape"
          value={uploadTags}
          onChange={(e) => setUploadTags(e.target.value)}
          disabled={isUploading}
          style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
        />
        <Space> {/* 使用 Space 组件来并排显示按钮 */}
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleSingleUpload}
            loading={isUploading && selectedFiles.length === 1}
            disabled={isUploading || selectedFiles.length !== 1}
          >
            {isUploading && selectedFiles.length === 1 ? '上传中...' : '上传 (单个)'}
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleBulkUpload}
            loading={isUploading && selectedFiles.length > 1}
            disabled={isUploading || selectedFiles.length <= 1}
          >
            {isUploading && selectedFiles.length > 1 ? `上传中... (${uploadedCount}/${totalFiles})` : '批量上传'}
          </Button>
        </Space>
        {uploadErrors.length > 0 && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <h3>上传失败文件:</h3>
            <ul>
              {uploadErrors.map((err, index) => (
                <li key={index}>{err.fileName}: {err.error}</li>
              ))}
            </ul>
          </div>
        )}
      </Space>
    </section>
  );
}

export default UploadSection;
