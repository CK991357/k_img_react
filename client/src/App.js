import { ConfigProvider, Layout, theme } from 'antd';
import { useState } from 'react';
import GallerySection from './components/GallerySection';
import ImageDetailSection from './components/ImageDetailSection';
import ImageEditorSection from './components/ImageEditorSection';
import UploadSection from './components/UploadSection';

const { Header, Content } = Layout;

function App() {
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
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#7e22ce',
          colorLink: '#8b5cf6',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        transition: 'background 0.5s ease'
      }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '0 50px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              color: '#7e22ce', 
              margin: 0,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #7e22ce, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              K-Edit Pro
            </h1>
          </div>
        </Header>
        <Content style={{ padding: '20px 50px' }}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
              boxShadow: '0 8px 30px rgba(126, 34, 206, 0.1)',
              transition: 'all 0.3s ease',
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
    </ConfigProvider>
  );
}

export default App;
