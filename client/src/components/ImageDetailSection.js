import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Image, Modal, Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * ImageDetailSection 组件：显示选中图片的详细信息
 * @param {object} props - 组件属性
 * @param {string|null} props.selectedPublicId - 当前选中图片的 public_id
 * @param {string|null} props.originalImageUrl - 当前选中图片的原图 URL
 * @param {function} props.setSelectedPublicId - 设置选中图片 public_id 的回调函数
 * @param {function} props.setOriginalImageUrl - 设置选中图片原图 URL 的回调函数
 * @param {boolean} props.isDetailModalOpen - 控制图片详情模态框是否打开的状态
 * @param {function} props.setIsDetailModalOpen - 设置图片详情模态框打开状态的回调函数
 * @param {boolean} props.darkMode - 是否处于暗黑模式
 * @returns {JSX.Element} - 图片详情部分的 JSX 元素
 */
function ImageDetailSection({ selectedPublicId, originalImageUrl, isDetailModalOpen, setIsDetailModalOpen, darkMode }) {
  /**
   * 处理模态框关闭事件，只关闭模态框，不清除选中的图片信息
   * @returns {void}
   */
  const handleCancel = () => {
    setIsDetailModalOpen(false);
  };

  /**
   * 将文本复制到剪贴板并显示成功提示
   * @param {string} text - 要复制的文本
   * @returns {void}
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Modal.success({
      title: '复制成功',
      content: '内容已复制到剪贴板',
      okButtonProps: {
        style: { background: darkMode ? '#7e22ce' : '#8b5cf6', border: 'none' }
      }
    });
  };

  return (
    <Modal
      title={<span style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>图片详情</span>}
      open={isDetailModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={'80%'}
      style={{ maxWidth: '800px' }}
      centered
      bodyStyle={{ 
        background: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: '12px'
      }}
    >
      <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
        {originalImageUrl && (
          <Image
            src={originalImageUrl}
            alt="图片详情"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '500px', 
              objectFit: 'contain',
              borderRadius: '8px',
              border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
            }}
          />
        )}
        
        <div style={{ 
          width: '100%', 
          background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(245, 243, 255, 0.5)', 
          padding: '16px', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Text strong style={{ color: darkMode ? '#c4b5fd' : '#7e22ce', minWidth: '100px' }}>
              Public ID:
            </Text>
            <Text 
              style={{ 
                flex: 1, 
                marginRight: '10px',
                color: darkMode ? '#e2e8f0' : '#334155',
                wordBreak: 'break-all'
              }}
            >
              {selectedPublicId || 'N/A'}
            </Text>
            <Button 
              icon={<CopyOutlined />} 
              onClick={() => copyToClipboard(selectedPublicId)}
              style={{ background: darkMode ? '#4c1d95' : '#ede9fe', border: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ color: darkMode ? '#c4b5fd' : '#7e22ce', minWidth: '100px' }}>
              URL:
            </Text>
            <Text 
              style={{ 
                flex: 1, 
                marginRight: '10px',
                color: darkMode ? '#93c5fd' : '#3b82f6',
                wordBreak: 'break-all'
              }}
            >
              {originalImageUrl || 'N/A'}
            </Text>
            <Space>
              <Button 
                icon={<LinkOutlined />} 
                onClick={() => window.open(originalImageUrl, '_blank')}
                style={{ background: darkMode ? '#4c1d95' : '#ede9fe', border: 'none' }}
              />
              <Button 
                icon={<CopyOutlined />} 
                onClick={() => copyToClipboard(originalImageUrl)}
                style={{ background: darkMode ? '#4c1d95' : '#ede9fe', border: 'none' }}
              />
            </Space>
          </div>
        </div>
      </Space>
    </Modal>
  );
}

export default ImageDetailSection;
