
import { Button, Image, message, Modal, Space, Typography } from 'antd'; // 添加 Button 和 message
import { deleteImage } from '../api'; // 导入 deleteImage

const { Text, Link } = Typography;

/**
 * ImageDetailSection 组件：显示选中图片的详细信息
 * @param {object} props - 组件属性
 * @param {string|null} props.selectedPublicId - 当前选中图片的 public_id
 * @param {string|null} props.originalImageUrl - 当前选中图片的原图 URL
 * @param {boolean} props.isDetailModalOpen - 控制图片详情模态框是否打开的状态
 * @param {function} props.setIsDetailModalOpen - 设置图片详情模态框打开状态的回调函数
 * @returns {JSX.Element} - 图片详情部分的 JSX 元素
 */
function ImageDetailSection({ selectedPublicId, originalImageUrl, isDetailModalOpen, setIsDetailModalOpen, tags, onDeleteSuccess }) { // 添加 tags 和 onDeleteSuccess
  /**
   * 处理模态框关闭事件，只关闭模态框
   * @returns {void}
   */
  const handleCancel = () => {
    setIsDetailModalOpen(false);
  };

  /**
   * 处理删除图片
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    if (!selectedPublicId) {
      message.error('无法删除：Public ID 不存在。');
      return;
    }
    try {
      await deleteImage(selectedPublicId);
      message.success('图片删除成功！');
      setIsDetailModalOpen(false);
      onDeleteSuccess(); // 通知父组件刷新
    } catch (error) {
      message.error(`删除图片失败: ${error.message}`);
    }
  };

  /**
   * 处理下载图片
   * @returns {void}
   */
  const handleDownload = () => {
    if (originalImageUrl) {
      const link = document.createElement('a');
      link.href = originalImageUrl;
      link.download = selectedPublicId ? `${selectedPublicId}.jpg` : 'downloaded_image.jpg'; // 使用publicId作为文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('图片下载中...');
    } else {
      message.error('无法下载：图片URL不存在。');
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--button-text-color)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px' }}>
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="var(--button-text-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V12" stroke="var(--button-text-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="var(--button-text-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          图片详情
        </div>
      }
      open={isDetailModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="delete" danger onClick={handleDelete}>
          删除图片
        </Button>,
        <Button key="download" type="primary" onClick={handleDownload}>
          下载
        </Button>,
      ]}
      centered
    >
      <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
        {originalImageUrl && (
          <Image
            src={originalImageUrl}
            alt="图片详情"
            className="image-detail-viewer-img" // 使用 CSS 类来控制样式
          />
        )}
        <Text strong style={{ color: 'var(--text-color)' }}>Public ID:</Text>
        <Text copyable style={{ color: 'var(--text-color)' }}>{selectedPublicId || 'N/A'}</Text>
        {tags && tags.length > 0 && ( // 检查tags是否存在且不为空
          <>
            <Text strong style={{ color: 'var(--text-color)' }}>Tags:</Text>
            <Text style={{ color: 'var(--text-color)' }}>{tags.join(', ')}</Text>
          </>
        )}
        <Text strong style={{ color: 'var(--text-color)' }}>URL:</Text>
        <Link href={originalImageUrl || '#'} target="_blank" rel="noopener noreferrer" copyable style={{ color: 'var(--link-accent-color)' }}>
          {originalImageUrl || 'N/A'}
        </Link>
      </Space>
    </Modal>
  );
}

export default ImageDetailSection;
