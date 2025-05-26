
import { Image, Modal, Space, Typography } from 'antd'; // 导入 Ant Design 组件

const { Text, Link } = Typography; // 解构 Typography

/**
 * ImageDetailSection 组件：显示选中图片的详细信息
 * @param {object} props - 组件属性
 * @param {string|null} props.selectedPublicId - 当前选中图片的 public_id
 * @param {string|null} props.originalImageUrl - 当前选中图片的原图 URL
 * @param {function} props.setSelectedPublicId - 设置选中图片 public_id 的回调函数
 * @param {function} props.setOriginalImageUrl - 设置选中图片原图 URL 的回调函数
 * @param {boolean} props.isDetailModalOpen - 控制图片详情模态框是否打开的状态
 * @param {function} props.setIsDetailModalOpen - 设置图片详情模态框打开状态的回调函数
 * @returns {JSX.Element} - 图片详情部分的 JSX 元素
 */
function ImageDetailSection({ selectedPublicId, originalImageUrl, isDetailModalOpen, setIsDetailModalOpen }) {
  /**
   * 处理模态框关闭事件，只关闭模态框，不清除选中的图片信息
   * @returns {void}
   */
  const handleCancel = () => {
    setIsDetailModalOpen(false); // 只关闭模态框
  };

  return (
    <Modal
      title="图片详情"
      open={isDetailModalOpen} // 使用新的状态控制模态框显示
      onCancel={handleCancel}
      footer={null} // 不显示底部按钮
      width={800} // 调整模态框宽度
      centered // 居中显示
    >
      <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
        {originalImageUrl && (
          <Image
            src={originalImageUrl}
            alt="图片详情"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        )}
        <Text strong>Public ID:</Text>
        <Text copyable>{selectedPublicId || 'N/A'}</Text>
        <Text strong>URL:</Text>
        <Link href={originalImageUrl || '#'} target="_blank" rel="noopener noreferrer" copyable>
          {originalImageUrl || 'N/A'}
        </Link>
      </Space>
    </Modal>
  );
}

export default ImageDetailSection;
