import { DeleteOutlined, FolderOutlined, SearchOutlined } from '@ant-design/icons'; // 导入 Ant Design 图标
import { Button, Card, Empty, Input, List, message, Space, Spin } from 'antd'; // 导入 Ant Design 组件
import { useCallback, useEffect, useState } from 'react';
import { deleteImage, fetchImages } from '../api'; // 导入 API 函数

const { useMessage } = message; // 解构 message

const { Meta } = Card; // 解构 Card 组件

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
  const [messageApi, contextHolder] = useMessage(); // 获取 messageApi 和 contextHolder
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
      setCurrentFolder(folder); // 更新父组件的当前文件夹状态
    } catch (err) {
      messageApi.error(`获取图片失败: ${err.message}`); // 使用 messageApi
      setError(err.message);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [setCurrentFolder, messageApi]); // 依赖 setCurrentFolder 和 messageApi

  // 组件挂载时、currentFolder 变化时和 refreshTrigger 变化时获取图片
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
    setIsDetailModalOpen(true); // 打开图片详情模态框
  };

  /**
   * 处理删除图片
   * @param {string} publicId - 要删除图片的 public ID
   * @returns {Promise<void>}
   */
  const handleDeleteImage = async (publicId) => {
    console.log('handleDeleteImage: 尝试删除图片，publicId:', publicId); // 添加日志

    // 使用浏览器原生的 confirm 替代 Ant Design 的 Modal.confirm 进行测试
    if (!window.confirm('确定要删除这张图片吗？此操作不可逆！')) {
      console.log('用户取消删除。'); // 添加日志
      return; // 用户取消删除
    }

    console.log('用户确认删除。'); // 添加日志
    try {
      console.log('调用 deleteImage API...'); // 添加日志
      await deleteImage(publicId);
      console.log('deleteImage API 调用成功。'); // 添加日志
      messageApi.success('图片已成功删除！'); // 使用 messageApi
      setSelectedPublicId(null); // 清空选中状态
      setOriginalImageUrl(null);
      fetchAndDisplayImages(currentFolder); // 刷新画廊
    } catch (err) {
      console.error('删除图片错误:', err); // 添加日志
      messageApi.error(`删除失败: ${err.message}`); // 使用 messageApi
    }
  };

  return (
    <section style={{ marginBottom: '20px' }}>
      {contextHolder} {/* 渲染 contextHolder */}
      <h2>图片画廊</h2>
      <Space style={{ marginBottom: '16px', width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <span style={{ whiteSpace: 'nowrap' }}>当前文件夹: </span>
          <Input
            prefix={<FolderOutlined />}
            placeholder="输入文件夹名称"
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            onClick={() => {
              fetchAndDisplayImages(folderInput);
              setFolderInput('');
              setSearchTagInput('');
            }}
          >
            跳转
          </Button>
        </Space>
        <Space>
          <Input.Search
            placeholder="按标签搜索 (例如: nature)"
            enterButton={<SearchOutlined />}
            value={searchTagInput}
            onChange={(e) => setSearchTagInput(e.target.value)}
            onSearch={(value) => {
              if (value) {
                fetchAndDisplayImages('', value);
              } else {
                message.warning('请输入要搜索的标签。');
              }
            }}
            style={{ width: 250 }}
          />
          <Button onClick={() => { setSearchTagInput(''); fetchAndDisplayImages(''); }}>清除搜索</Button>
        </Space>
      </Space>

      <Spin spinning={loading} tip="加载图片中...">
        {error && <Empty description={`获取图片失败: ${error}`} />}
        {!loading && !error && images.length === 0 && <Empty description="暂无图片，请先上传。" />}
        {!loading && !error && images.length > 0 && (
          <List
            grid={{
              gutter: 16,
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
                      onClick={(e) => { // 添加事件对象 e
                        e.stopPropagation(); // 阻止事件冒泡
                        handleDeleteImage(image.public_id);
                      }}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <Meta title={image.public_id.split('/').pop()} description={currentFolder ? `文件夹: ${currentFolder}` : '所有上传图片'} />
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
