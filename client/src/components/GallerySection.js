import { DeleteOutlined, FolderOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Input, List, message, Space, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { deleteImage, fetchImages } from '../api';

const { useMessage } = message;
const { Meta } = Card;

/**
 * GallerySection 组件：显示图片画廊，处理文件夹导航和标签搜索
 * @param {object} props - 组件属性
 * @param {string} props.currentFolder - 当前显示的文件夹
 * @param {function} props.setCurrentFolder - 设置当前文件夹的回调函数
 * @param {function} props.setSelectedPublicId - 设置当前选中图片 public_id 的回调函数
 * @param {function} props.setOriginalImageUrl - 设置当前选中图片原图 URL 的回调函数
 * @param {number} props.refreshTrigger - 用于触发画廊刷新的依赖项
 * @param {function} props.setIsDetailModalOpen - 设置图片详情模态框打开状态的回调函数
 * @returns {JSX.Element} - 图片画廊部分的 JSX 元素
 */
function GallerySection({ currentFolder, setCurrentFolder, setSelectedPublicId, setOriginalImageUrl, refreshTrigger, setIsDetailModalOpen }) {
  const [messageApi, contextHolder] = useMessage();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folderInput, setFolderInput] = useState('');
  const [searchTagInput, setSearchTagInput] = useState('');

  /**
   * 从后端获取图片列表并显示在画廊中
   * @param {string} [folder=''] - 要获取图片的文件夹名称 (可选)。如果为空，则获取所有上传图片。
   * @param {string} [tag=''] - 可选的标签，用于过滤图片
   * @returns {Promise<void>}
   */
  const fetchAndDisplayImages = useCallback(async (folder = '', tag = '') => {
    setLoading(true);
    setError(null);
    try {
      const fetchedImages = await fetchImages(folder, tag);
      setImages(fetchedImages);
      setCurrentFolder(folder);
    } catch (err) {
      messageApi.error(`获取图片失败: ${err.message}`);
      setError(err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [setCurrentFolder, messageApi]);

  useEffect(() => {
    fetchAndDisplayImages(currentFolder);
  }, [fetchAndDisplayImages, currentFolder, refreshTrigger]);

  /**
   * 处理图片点击事件，设置选中图片信息
   * @param {object} image - 被点击的图片对象
   * @returns {void}
   */
  const handleImageClick = (image) => {
    setSelectedPublicId(image.public_id);
    setOriginalImageUrl(image.secure_url);
    setIsDetailModalOpen(true);
  };

  /**
   * 处理删除图片
   * @param {string} publicId - 要删除图片的 public ID
   * @returns {Promise<void>}
   */
  const handleDeleteImage = async (publicId) => {
    if (!window.confirm('确定要删除这张图片吗？此操作不可逆！')) {
      return;
    }

    try {
      await deleteImage(publicId);
      messageApi.success('图片已成功删除！');
      setSelectedPublicId(null);
      setOriginalImageUrl(null);
      fetchAndDisplayImages(currentFolder);
    } catch (err) {
      messageApi.error(`删除失败: ${err.message}`);
    }
  };

  return (
    <section style={{ marginBottom: '24px' }}>
      {contextHolder}
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
          <path d="M4 8H20M4 16H20M8 4V20M16 4V20" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        图片画廊
      </h2>
      <div style={{ marginBottom: '20px' }}>
        <Space size={[8, 16]} wrap style={{ width: '100%', justifyContent: 'flex-start' }}>
          <span style={{ whiteSpace: 'nowrap', fontWeight: 500, color: '#5b21b6' }}>当前文件夹: </span>
          <Input
            prefix={<FolderOutlined style={{ color: '#8b5cf6' }} />}
            placeholder="输入文件夹名称"
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
            style={{ flexGrow: 1, minWidth: '150px', maxWidth: 'calc(100% - 100px)' }}
          />
          <Button
            type="primary"
            icon={<FolderOutlined />}
            onClick={() => {
              fetchAndDisplayImages(folderInput);
              setFolderInput('');
              setSearchTagInput('');
            }}
          >
            跳转
          </Button>
        </Space>
        <Space size={[8, 16]} wrap style={{ width: '100%', justifyContent: 'flex-start', marginTop: '16px' }}>
          <Input.Search
            placeholder="按标签搜索 (例如: nature)"
            enterButton={<Button type="primary" icon={<SearchOutlined />} />}
            value={searchTagInput}
            onChange={(e) => setSearchTagInput(e.target.value)}
            onSearch={(value) => {
              if (value) {
                fetchAndDisplayImages('', value);
              } else {
                message.warning('请输入要搜索的标签。');
              }
            }}
            style={{ flexGrow: 1, minWidth: '200px', maxWidth: 'calc(100% - 100px)' }}
          />
          <Button onClick={() => { setSearchTagInput(''); fetchAndDisplayImages(''); }}>清除搜索</Button>
        </Space>
      </div>

      <Spin spinning={loading} tip="加载图片中...">
        {error && <Empty description={`获取图片失败: ${error}`} />}
        {!loading && !error && images.length === 0 && <Empty description="暂无图片，请先上传。" />}
        {!loading && !error && images.length > 0 && (
          <List
            grid={{
              gutter: 20,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 5,
              xxl: 6,
            }}
            dataSource={images}
            renderItem={(image) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={
                    <img
                      alt={image.public_id}
                      src={image.secure_url}
                      style={{ width: '100%', height: 180, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleImageClick(image)}
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.public_id);
                      }}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <Meta 
                    title={image.public_id.split('/').pop()} 
                    description={currentFolder ? `文件夹: ${currentFolder}` : '所有上传图片'} 
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </section>
  );
}

export default GallerySection;
