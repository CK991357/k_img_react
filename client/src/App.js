import { MoonOutlined, SunOutlined } from '@ant-design/icons'; // 引入太阳和月亮图标
import { Layout, message, Switch, theme } from 'antd';
import { useEffect, useState } from 'react';
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
  const [selectedImageTags, setSelectedImageTags] = useState([]); // 新增 state
  const [refreshGallery, setRefreshGallery] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    /**
     * @function getInitialDarkMode
     * @description 从 localStorage 获取初始的夜览模式状态。
     * @returns {boolean} 如果 localStorage 中存在 'darkMode' 且为 'true'，则返回 true，否则返回 false。
     */
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  useEffect(() => {
    /**
     * @function updateBodyClass
     * @description 根据 isDarkMode 状态更新 body 元素的 class。
     * @param {boolean} darkMode - 是否处于夜览模式。
     * @returns {void}
     */
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    /**
     * @function saveDarkModePreference
     * @description 将当前的夜览模式状态保存到 localStorage。
     * @param {boolean} darkMode - 要保存的夜览模式状态。
     * @returns {void}
     */
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  /**
   * @function handleUploadSuccess
   * @description 处理图片上传成功后的逻辑，触发图片画廊刷新。
   * @returns {void}
   */
  const handleUploadSuccess = () => {
    setRefreshGallery(prev => prev + 1);
  };

  /**
   * @function toggleDarkMode
   * @description 切换夜览模式的状态。
   * @param {boolean} checked - Switch 组件的选中状态。
   * @returns {void}
   */
  const toggleDarkMode = (checked) => {
    setIsDarkMode(checked);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--primary-bg-color)' }}>
      {contextHolder}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, var(--top-navbar-gradient-start) 0%, var(--top-navbar-gradient-end) 100%)',
          color: 'var(--button-text-color)',
          padding: '0', /* 移除左右内边距 */
          boxShadow: '0 4px 12px var(--section-title-shadow-color)',
          position: 'fixed', // 固定定位
          width: '100%', // 宽度占满
          zIndex: 1000, // 确保在其他内容之上
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
            <g fill="var(--button-text-color)"> {/* Changed fill to use CSS variable */}
              <circle cx="9" cy="12" r="3"/>
              <circle cx="15" cy="10" r="3"/>
              <ellipse cx="14" cy="14" rx="6" ry="4"/>
            </g>
          </svg>
          <h1 style={{ color: 'var(--button-text-color)', margin: 0, fontWeight: 600, letterSpacing: '0.5px' }}>K-Edit 图片管理</h1>
        </div>
        {/* Dark Mode Toggle Switch */}
        <Switch
          checkedChildren={<MoonOutlined />} // 夜览模式显示月亮图标
          unCheckedChildren={<SunOutlined />} // 日间模式显示太阳图标
          checked={isDarkMode}
          onChange={toggleDarkMode}
          style={{
            backgroundColor: isDarkMode ? 'var(--toggle-active-color)' : 'var(--toggle-track-bg-color)',
            borderColor: isDarkMode ? 'var(--toggle-active-color)' : 'var(--toggle-track-bg-color)',
          }}
        />
      </Header>
      <Content style={{ padding: '74px 2px 10px 0px' }}> {/* 调整整体内容区域的内边距，适应移动端，左侧更靠近边缘，并为固定头部留出空间 (64px Header + 10px original top padding) */}
        <div
          style={{
            background: 'var(--card-bg-color)',
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            boxShadow: '0 6px 16px var(--section-box-shadow-color)', /* Use CSS variable */
            border: '1px solid var(--section-border-color)', /* Use CSS variable */
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
            setSelectedImageTags={setSelectedImageTags} // 传递 setSelectedImageTags
            refreshTrigger={refreshGallery}
            setIsDetailModalOpen={setIsDetailModalOpen}
          />
 
          <ImageDetailSection
            selectedPublicId={selectedPublicId}
            originalImageUrl={originalImageUrl}
            tags={selectedImageTags} // 传递 tags
            isDetailModalOpen={isDetailModalOpen}
            setIsDetailModalOpen={setIsDetailModalOpen}
            onDeleteSuccess={handleUploadSuccess} // 复用 handleUploadSuccess 来刷新画廊
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
