import { Layout, message, theme } from 'antd';
import { useState } from 'react';
import './App.css';
import GallerySection from './components/GallerySection';
import ImageDetailSection from './components/ImageDetailSection';
import ImageEditorSection from './components/ImageEditorSection';
import UploadSection from './components/UploadSection';

const { Header, Content } = Layout;

function App() {
  const [, contextHolder] = message.useMessage();
  const [currentFolder, setCurrentFolder] = useState('');
  const [selectedPublicId, setSelectedPublicId] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleUploadSuccess = () => {
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f4ff 0%, #f0e6ff 100%)' }}>
      {contextHolder}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'linear-gradient(90deg, #6a0dad 0%, #8a2be2 100%)',
          color: '#fff',
          padding: '0 50px',
          boxShadow: '0 4px 12px rgba(106, 13, 173, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
            <g fill="#FFFFFF">
              <circle cx="9" cy="12" r="3"/>
              <circle cx="15" cy="10" r="3"/>
              <ellipse cx="14" cy="14" rx="6" ry="4"/>
            </g>
          </svg>
          <h1 style={{ color: '#fff', margin: 0, fontWeight: 600, letterSpacing: '0.5px' }}>K-Edit 图片管理</h1>
        </div>
      </Header>
      <Content style={{ padding: '10px 2px 10px 0px' }}> {/* 调整整体内容区域的内边距，适应移动端，左侧更靠近边缘 */}
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            boxShadow: '0 6px 16px rgba(106, 13, 173, 0.08)',
            border: '1px solid #f0e6ff',
            maxWidth: '95%', /* 设置最大宽度为100% */
            margin: '10px auto', /* 居中显示，并增加上下边距 */
          }}
        >
          <UploadSection onUploadSuccess={handleUploadSuccess} />

          <GallerySection
            currentFolder={currentFolder}
            setCurrentFolder={setCurrentFolder}
            setSelectedPublicId={setSelectedPublicId}
            setOriginalImageUrl={setOriginalImageUrl}
            refreshTrigger={refreshGallery}
            setIsDetailModalOpen={setIsDetailModalOpen}
          />

          <ImageDetailSection
            selectedPublicId={selectedPublicId}
            originalImageUrl={originalImageUrl}
            isDetailModalOpen={isDetailModalOpen}
            setIsDetailModalOpen={setIsDetailModalOpen}
          />

          <ImageEditorSection
            selectedPublicId={selectedPublicId}
            originalImageUrl={originalImageUrl}
            setRefreshGallery={setRefreshGallery}
            setSelectedPublicId={setSelectedPublicId}
            setOriginalImageUrl={setOriginalImageUrl}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
