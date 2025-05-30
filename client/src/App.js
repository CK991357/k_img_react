import { Layout, message, theme } from 'antd'; // 导入 Ant Design 的 Layout 和 message 组件
import { useState } from 'react';
import GallerySection from './components/GallerySection';
import ImageDetailSection from './components/ImageDetailSection';
import ImageEditorSection from './components/ImageEditorSection';
import UploadSection from './components/UploadSection';
// import './App.css'; // 移除默认的App.css导入

const { Header, Content } = Layout; // 解构 Layout 组件

/**
 * App 组件：应用的根组件，负责整体布局和状态管理
 * @returns {JSX.Element} - 应用的 JSX 元素
 */
function App() {
  const [, contextHolder] = message.useMessage(); // 移除 messageApi 的解构，因为它未被使用
  const [currentFolder, setCurrentFolder] = useState(''); // 管理当前文件夹
  const [selectedPublicId, setSelectedPublicId] = useState(null); // 管理当前选中的图片 public_id
  const [originalImageUrl, setOriginalImageUrl] = useState(null); // 管理当前选中图片的原图 URL
  const [refreshGallery, setRefreshGallery] = useState(0); // 用于触发画廊刷新
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 控制图片详情模态框的显示

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  /**
   * 处理图片上传成功后的回调
   * @returns {void}
   */
  const handleUploadSuccess = () => {
    // 上传成功后，触发画廊刷新
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder} {/* 渲染 contextHolder */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start', // 将标题移动到左侧
          backgroundColor: '#fff', // 白色背景
          color: '#fff', // Header 的 color 保持白色，因为 h1 会覆盖
          padding: '0 50px', // 调整标题内边距，使其与内容对齐
        }}
      >
        <h1 style={{ color: '#1890ff', margin: 0 }}>K-Edit</h1>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <UploadSection onUploadSuccess={handleUploadSuccess} />

          <GallerySection
            currentFolder={currentFolder}
            setCurrentFolder={setCurrentFolder}
            setSelectedPublicId={setSelectedPublicId}
            setOriginalImageUrl={setOriginalImageUrl}
            refreshTrigger={refreshGallery} // 传递刷新触发器
            setIsDetailModalOpen={setIsDetailModalOpen} // 传递控制模态框显示的状态设置函数
          />

      <ImageDetailSection
        selectedPublicId={selectedPublicId}
        originalImageUrl={originalImageUrl}
        isDetailModalOpen={isDetailModalOpen} // 传递模态框显示状态
        setIsDetailModalOpen={setIsDetailModalOpen} // 传递模态框显示状态设置函数
      />

          <ImageEditorSection
            selectedPublicId={selectedPublicId}
            originalImageUrl={originalImageUrl}
            setRefreshGallery={setRefreshGallery}
            setSelectedPublicId={setSelectedPublicId}
            setOriginalImageUrl={setOriginalImageUrl}
          />
        </div>
        {/* 其他组件将在这里添加 */}
      </Content>
    </Layout>
  );
}

export default App;
