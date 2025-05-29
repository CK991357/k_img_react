import { Button, Checkbox, Col, Collapse, Image, Input, InputNumber, message, Row, Select, Slider, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { applyTransformations, saveTransformedImage } from '../api';

const { Panel } = Collapse;

/**
 * ImageEditorSection 组件：处理图片编辑功能
 * @param {object} props - 组件属性
 * @param {string|null} props.selectedPublicId - 当前选中图片的 public_id
 * @param {string|null} props.originalImageUrl - 当前选中图片的原图 URL
 * @param {function} props.setRefreshGallery - 触发画廊刷新的回调函数
 * @param {function} props.setSelectedPublicId - 设置当前选中图片 public_id 的回调函数
 * @param {function} props.setOriginalImageUrl - 设置当前选中图片原图 URL 的回调函数
 * @param {boolean} props.darkMode - 是否处于暗黑模式
 * @returns {JSX.Element} - 图片编辑部分的 JSX 元素
 */
function ImageEditorSection({ selectedPublicId, originalImageUrl, setRefreshGallery, setSelectedPublicId, setOriginalImageUrl, darkMode }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [transformedImageUrl, setTransformedImageUrl] = useState(null);
  const [currentTransformations, setCurrentTransformations] = useState({});
  
  // 颜色调整状态
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [fillLight, setFillLight] = useState(0);
  const [fillLightBlend, setFillLightBlend] = useState(0);

  // 增强效果状态
  const [improve, setImprove] = useState(false);
  const [autoBrightness, setAutoBrightness] = useState(false);
  const [autoColor, setAutoColor] = useState(false);
  const [autoContrast, setAutoContrast] = useState(false);
  const [sharpen, setSharpen] = useState(false);
  const [vibrance, setVibrance] = useState(false); // Vibrance 变为布尔值，表示是否应用
  const [upscale, setUpscale] = useState(false);
  const [enhance, setEnhance] = useState(false);

  // 艺术效果状态
  const [cartoonify, setCartoonify] = useState(false);
  const [sepia, setSepia] = useState(false);
  const [vignette, setVignette] = useState(false);
  const [pixelateEffect, setPixelateEffect] = useState(false); // 与 pixelate 转换区分
  const [grayscale, setGrayscale] = useState(false);
  const [artFilter, setArtFilter] = useState(''); // 用于 e_art 效果

  // 背景与阴影状态
  const [removeBackground, setRemoveBackground] = useState(false);
  const [shadow, setShadow] = useState(false);

  // 不透明度状态
  const [opacity, setOpacity] = useState(100);

  // 替换颜色状态
  const [replaceColorFrom, setReplaceColorFrom] = useState('');
  const [replaceColorTo, setReplaceColorTo] = useState('');
  const [replaceColorTolerance, setReplaceColorTolerance] = useState(0);

  // 图像转换状态
  const [format, setFormat] = useState('');
  const [cropMode, setCropMode] = useState('');
  const [cropWidth, setCropWidth] = useState('');
  const [cropHeight, setCropHeight] = useState('');
  const [cropGravity, setCropGravity] = useState(''); // 新增重力参数
  const [quality, setQuality] = useState(100);
  const [qualityAuto, setQualityAuto] = useState(false);
  const [dpr, setDpr] = useState(1);
  const [dprAuto, setDprAuto] = useState(false);

  // 模糊与像素化状态
  const [blurStrength, setBlurStrength] = useState(0);
  const [pixelateStrength, setPixelateStrength] = useState(0);
  const [blurFaces, setBlurFaces] = useState(false);
  const [pixelateFaces, setPixelateFaces] = useState(false);

  // 当 selectedPublicId 或 originalImageUrl 变化时，重置编辑器状态
  useEffect(() => {
    setTransformedImageUrl(originalImageUrl);
    setCurrentTransformations({});
    // 重置颜色调整滑块
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setFillLight(0);
    setFillLightBlend(0);
    // 重置增强效果
    setImprove(false);
    setAutoBrightness(false);
    setAutoColor(false);
    setAutoContrast(false);
    setSharpen(false);
    setVibrance(false); // 重置为 false
    setUpscale(false);
    setEnhance(false);
    // 重置艺术效果
    setCartoonify(false);
    setSepia(false);
    setVignette(false);
    setPixelateEffect(false);
    setGrayscale(false);
    setArtFilter('');
    // 重置背景与阴影效果
    setRemoveBackground(false);
    setShadow(false);
    // 重置不透明度
    setOpacity(100);
    // 重置替换颜色
    setReplaceColorFrom('');
    setReplaceColorTo('');
    setReplaceColorTolerance(0);
    // 重置图像转换
    setFormat('');
    setCropMode('');
    setCropWidth('');
    setCropHeight('');
    setCropGravity('');
    setQuality(100);
    setQualityAuto(false);
    setDpr(1);
    setDprAuto(false);
    // 重置模糊与像素化
    setBlurStrength(0);
    setPixelateStrength(0);
    setBlurFaces(false);
    setPixelateFaces(false);
  }, [selectedPublicId, originalImageUrl]);

  /**
   * 应用图片转换效果
   * @param {object} transformations - 包含所有转换效果和参数的对象
   * @returns {Promise<void>}
   */
  const handleApplyTransformations = useCallback(async (transformations) => {
    if (!selectedPublicId) {
      // alert('请先从画廊中选择一张图片进行编辑。'); // 避免重复弹窗 
      return;
    }

    // 如果没有应用任何转换，则显示原图
    if (Object.keys(transformations).length === 0) {
      setTransformedImageUrl(originalImageUrl);
      return;
    }

    try {
      const url = await applyTransformations(selectedPublicId, transformations);
      setTransformedImageUrl(url);
    } catch (error) {
      alert(`转换失败: ${error.message}`);
    }
  }, [selectedPublicId, originalImageUrl, setTransformedImageUrl]); // 添加依赖项

  /**
   * 更新单个转换参数并重新应用所有转换
   * @param {string} effectType - 效果类型 (例如: 'e_brightness')
   * @param {string} [paramName] - 参数名称 (例如: 'level')。对于无参数效果可省略。
   * @param {any} [value] - 参数值。对于无参数效果可省略。
   * @returns {void}
   */
  const updateTransformation = (effectType, paramName, value) => {
    setCurrentTransformations(prev => {
      const newTransformations = { ...prev };

      if (paramName === undefined) { // 处理无参数效果 (例如: improve, auto_brightness)
        if (value === false) { // 如果是关闭效果
          delete newTransformations[effectType];
        } else { // 如果是开启效果
          newTransformations[effectType] = {}; // 效果存在即可，无需参数
        }
      } else { // 处理有参数效果
        if (!newTransformations[effectType]) {
          newTransformations[effectType] = {};
        }
        newTransformations[effectType][paramName] = value;
      }
      return newTransformations;
    });
  };

  // 监听 currentTransformations 变化并自动应用
  useEffect(() => {
    if (selectedPublicId) {
      handleApplyTransformations(currentTransformations);
    }
  }, [currentTransformations, selectedPublicId, handleApplyTransformations]); // 添加 handleApplyTransformations

  /**
   * 保存转换后的图片到 Cloudinary
   * @returns {Promise<void>}
   */
  const handleSaveTransformedImage = async () => {
    if (!selectedPublicId) {
      messageApi.open({
        type: 'warning',
        content: '请先从画廊中选择一张图片进行编辑。',
      });
      return;
    }
    if (!transformedImageUrl || transformedImageUrl === originalImageUrl) {
      messageApi.open({
        type: 'warning',
        content: '没有转换后的图片可以保存。请先应用转换。',
      });
      return;
    }

    try {
      // 从 selectedPublicId 中解析出文件夹名称
      // 例如：'Jay/unkcruhav3aikzm3bre0' -> 'Jay'
      // 'image_id' -> '' (或默认文件夹)
      const folderMatch = selectedPublicId ? selectedPublicId.match(/(.*)\/[^/]+$/) : null;
      const targetFolder = folderMatch ? folderMatch[1] : 'worker_uploads'; // 如果没有文件夹，则默认保存到 'worker_uploads'

      await saveTransformedImage(transformedImageUrl, targetFolder);
      messageApi.open({
        type: 'success',
        content: `转换后图片已成功保存到 Cloudinary 文件夹: ${targetFolder}！`,
      });
      setRefreshGallery(prev => prev + 1); // 触发画廊刷新
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `保存失败: ${error.message}`,
      });
    }
  };

  /**
   * 重置所有效果
   * @returns {void}
   */
  const handleResetAllEffects = () => {
    if (!selectedPublicId) {
      messageApi.open({
        type: 'warning',
        content: '请先从画廊中选择一张图片进行编辑。',
      });
      return;
    }
    setCurrentTransformations({});
    setTransformedImageUrl(originalImageUrl);
    // 重置颜色调整滑块
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setFillLight(0);
    setFillLightBlend(0);
    // 重置增强效果
    setImprove(false);
    setAutoBrightness(false);
    setAutoColor(false);
    setAutoContrast(false);
    setSharpen(false);
    setVibrance(false); // 重置为 false
    setUpscale(false);
    setEnhance(false);
    // 重置艺术效果
    setCartoonify(false);
    setSepia(false);
    setVignette(false);
    setPixelateEffect(false);
    setGrayscale(false);
    setArtFilter('');
    // 重置背景与阴影效果
    setRemoveBackground(false);
    setShadow(false);
    // 重置不透明度
    setOpacity(100);
    // 重置替换颜色
    setReplaceColorFrom('');
    setReplaceColorTo('');
    setReplaceColorTolerance(0);
    // 重置图像转换
    setFormat('');
    setCropMode('');
    setCropWidth('');
    setCropHeight('');
    setCropGravity('');
    setQuality(100);
    setQualityAuto(false);
    setDpr(1);
    setDprAuto(false);
    // 重置模糊与像素化
    setBlurStrength(0);
    setPixelateStrength(0);
    setBlurFaces(false);
    setPixelateFaces(false);
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
        <h2>图片编辑</h2>
        
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12} style={{ marginBottom: 16 }}>
            <div style={{ 
              textAlign: 'center', 
              padding: 16,
              borderRadius: 12,
              background: darkMode ? '#1e293b' : '#f5f3ff',
              border: darkMode ? '1px solid #334155' : '1px solid #ddd6fe'
            }}>
              <h3 style={{ color: darkMode ? '#e9d5ff' : '#7e22ce' }}>原图</h3>
              <Image
                src={originalImageUrl || ''}
                alt="原图"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'contain', 
                  borderRadius: 8,
                  border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div style={{ 
              textAlign: 'center', 
              padding: 16,
              borderRadius: 12,
              background: darkMode ? '#1e293b' : '#f5f3ff',
              border: darkMode ? '1px solid #334155' : '1px solid #ddd6fe'
            }}>
              <h3 style={{ color: darkMode ? '#e9d5ff' : '#7e22ce' }}>转换后图片</h3>
              <Image
                src={transformedImageUrl || ''}
                alt="转换后图片"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'contain', 
                  borderRadius: 8,
                  border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
            </div>
          </Col>
        </Row>

        {/* 颜色调整面板 - 示例，其他面板保持类似结构 */}
        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>颜色调整</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="brightnessSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>亮度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                  value={typeof brightness === 'number' ? brightness : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={-100}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={brightness}
                  onChange={(val) => {
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="contrastSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>对比度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                  value={typeof contrast === 'number' ? contrast : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={-100}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={contrast}
                  onChange={(val) => {
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="saturationSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>饱和度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                  value={typeof saturation === 'number' ? saturation : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={-100}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={saturation}
                  onChange={(val) => {
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="fillLightSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>补光:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                  value={typeof fillLight === 'number' ? fillLight : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={fillLight}
                  onChange={(val) => {
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="fillLightBlendSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>补光混合:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                  value={typeof fillLightBlend === 'number' ? fillLightBlend : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={fillLightBlend}
                  onChange={(val) => {
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                />
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>增强效果</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* 第一行增强效果按钮 */}
              <Space wrap>
                <Button
                  type={improve ? 'primary' : 'default'}
                  onClick={() => {
                    setImprove(!improve);
                    updateTransformation('improve', undefined, !improve);
                  }}
                  className="effect-button"
                >
                  Improve
                </Button>
                <Button
                  type={autoBrightness ? 'primary' : 'default'}
                  onClick={() => {
                    setAutoBrightness(!autoBrightness);
                    updateTransformation('auto_brightness', undefined, !autoBrightness);
                  }}
                  className="effect-button"
                >
                  Auto Brightness
                </Button>
                <Button
                  type={autoColor ? 'primary' : 'default'}
                  onClick={() => {
                    setAutoColor(!autoColor);
                    updateTransformation('auto_color', undefined, !autoColor);
                  }}
                  className="effect-button"
                >
                  Auto Color
                </Button>
                <Button
                  type={autoContrast ? 'primary' : 'default'}
                  onClick={() => {
                    setAutoContrast(!autoContrast);
                    updateTransformation('auto_contrast', undefined, !autoContrast);
                  }}
                  className="effect-button"
                >
                  Auto Contrast
                </Button>
              </Space>
              {/* 第二行增强效果按钮，从 Sharpen 开始 */}
              <Space wrap>
                <Button
                  type={sharpen ? 'primary' : 'default'}
                  onClick={() => {
                    setSharpen(!sharpen);
                    updateTransformation('sharpen', undefined, !sharpen);
                  }}
                  className="effect-button"
                >
                  Sharpen
                </Button>
                <Button
                  type={vibrance ? 'primary' : 'default'}
                  onClick={() => {
                    setVibrance(!vibrance);
                    updateTransformation('e_vibrance', undefined, !vibrance); // 将 vibrance 作为一个无参数效果处理
                  }}
                  className="effect-button"
                >
                  Vibrance
                </Button>
                <Button
                  type={upscale ? 'primary' : 'default'}
                  onClick={() => {
                    setUpscale(!upscale);
                    updateTransformation('upscale', undefined, !upscale);
                  }}
                  className="effect-button"
                >
                  Upscale
                </Button>
                <Button
                  type={enhance ? 'primary' : 'default'}
                  onClick={() => {
                    setEnhance(!enhance);
                    updateTransformation('enhance', undefined, !enhance);
                  }}
                  className="effect-button"
                >
                  Enhance
                </Button>
              </Space>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>艺术效果</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <Button
                  type={cartoonify ? 'primary' : 'default'}
                  onClick={() => {
                    setCartoonify(!cartoonify);
                    updateTransformation('cartoonify', undefined, !cartoonify);
                  }}
                  className="effect-button"
                >
                  Cartoonify
                </Button>
                <Button
                  type={sepia ? 'primary' : 'default'}
                  onClick={() => {
                    setSepia(!sepia);
                    updateTransformation('sepia', undefined, !sepia);
                  }}
                  className="effect-button"
                >
                  Sepia
                </Button>
                <Button
                  type={vignette ? 'primary' : 'default'}
                  onClick={() => {
                    setVignette(!vignette);
                    updateTransformation('vignette', undefined, !vignette);
                  }}
                  className="effect-button"
                >
                  Vignette
                </Button>
                <Button
                  type={pixelateEffect ? 'primary' : 'default'}
                  onClick={() => {
                    setPixelateEffect(!pixelateEffect);
                    updateTransformation('pixelate', undefined, !pixelateEffect);
                  }}
                  className="effect-button"
                >
                  Pixelate Effect
                </Button>
                <Button
                  type={grayscale ? 'primary' : 'default'}
                  onClick={() => {
                    setGrayscale(!grayscale);
                    updateTransformation('grayscale', undefined, !grayscale);
                  }}
                  className="effect-button"
                >
                  Grayscale
                </Button>
              </div>
              <div className="effect-group">
                <label htmlFor="artFilterSelect" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>Art Filter:</label>
                <Select
                  id="artFilterSelect"
                  value={artFilter}
                  onChange={(val) => {
                    setArtFilter(val);
                    if (val) {
                      updateTransformation('e_art', 'filter', val);
                    } else {
                      setCurrentTransformations(prev => {
                        const newTransformations = { ...prev };
                        delete newTransformations['e_art'];
                        return newTransformations;
                      });
                    }
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                  dropdownStyle={{ background: darkMode ? '#1e293b' : '#ffffff' }}
                  optionLabelProp="children"
                  optionFilterProp="children"
                >
                  <Select.Option value="" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>None</Select.Option>
                  <Select.Option value="al_dente" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Al Dente</Select.Option>
                  <Select.Option value="athena" style={{ color: darkMode ? '#e2e8f0' : '#334153', background: darkMode ? '#1e293b' : '#ffffff' }}>Athena</Select.Option>
                  <Select.Option value="audrey" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Audrey</Select.Option>
                  <Select.Option value="aurora" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Aurora</Select.Option>
                  <Select.Option value="daguerre" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Daguerre</Select.Option>
                  <Select.Option value="eucalyptus" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Eucalyptus</Select.Option>
                  <Select.Option value="fes" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Fes</Select.Option>
                  <Select.Option value="hokusai" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Hokusai</Select.Option>
                  <Select.Option value="incognito" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Incognito</Select.Option>
                  <Select.Option value="linen" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Linen</Select.Option>
                  <Select.Option value="peacock" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Peacock</Select.Option>
                  <Select.Option value="primavera" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Primavera</Select.Option>
                  <Select.Option value="quartz" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Quartz</Select.Option>
                  <Select.Option value="red_rock" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Red Rock</Select.Option>
                  <Select.Option value="sizzle" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Sizzle</Select.Option>
                  <Select.Option value="sonnet" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Sonnet</Select.Option>
                  <Select.Option value="ukiyo" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Ukiyo</Select.Option>
                  <Select.Option value="zorro" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Zorro</Select.Option>
                </Select>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>背景与阴影</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <Button
                  type={removeBackground ? 'primary' : 'default'}
                  onClick={() => {
                    setRemoveBackground(!removeBackground);
                    updateTransformation('remove_background', undefined, !removeBackground);
                  }}
                  className="effect-button"
                >
                  Remove Background
                </Button>
                <Button
                  type={shadow ? 'primary' : 'default'}
                  onClick={() => {
                    setShadow(!shadow);
                    updateTransformation('shadow', undefined, !shadow);
                  }}
                  className="effect-button"
                >
                  Shadow
                </Button>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>不透明度</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="opacitySlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>不透明度:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                  value={typeof opacity === 'number' ? opacity : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={opacity}
                  onChange={(val) => {
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                />
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>替换颜色</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="replaceColorFrom" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>源颜色 (Hex):</label>
                <Input
                  id="replaceColorFrom"
                  placeholder="#RRGGBB 或 color_name"
                  value={replaceColorFrom}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReplaceColorFrom(val);
                    updateTransformation('e_replace_color', 'from_color', val);
                  }}
                  style={{ flex: 1, margin: '0 10px', background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="replaceColorTo" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>目标颜色 (Hex):</label>
                <Input
                  id="replaceColorTo"
                  placeholder="#RRGGBB 或 color_name"
                  value={replaceColorTo}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReplaceColorTo(val);
                    updateTransformation('e_replace_color', 'to_color', val);
                  }}
                  style={{ flex: 1, margin: '0 10px', background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="replaceColorTolerance" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>容差 (0-100):</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                  value={typeof replaceColorTolerance === 'number' ? replaceColorTolerance : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={replaceColorTolerance}
                  onChange={(val) => {
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                />
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>图像转换</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="formatSelect" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>格式转换:</label>
                <Select
                  id="formatSelect"
                  value={format}
                  onChange={(val) => {
                    setFormat(val);
                    if (val) {
                      updateTransformation('f', 'format', val);
                    } else {
                      setCurrentTransformations(prev => {
                        const newTransformations = { ...prev };
                        delete newTransformations['f'];
                        return newTransformations;
                      });
                    }
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                  dropdownStyle={{ background: darkMode ? '#1e293b' : '#ffffff' }}
                  optionLabelProp="children"
                  optionFilterProp="children"
                >
                  <Select.Option value="" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Original</Select.Option>
                  <Select.Option value="jpg" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>JPG</Select.Option>
                  <Select.Option value="png" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>PNG</Select.Option>
                  <Select.Option value="webp" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>WebP</Select.Option>
                  <Select.Option value="gif" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>GIF</Select.Option>
                  <Select.Option value="bmp" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>BMP</Select.Option>
                  <Select.Option value="tiff" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>TIFF</Select.Option>
                  <Select.Option value="pdf" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>PDF</Select.Option>
                </Select>
              </div>

              <div className="effect-group">
                <label htmlFor="cropModeSelect" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>裁剪模式:</label>
                <Select
                  id="cropModeSelect"
                  value={cropMode}
                  onChange={(val) => {
                    setCropMode(val);
                    updateTransformation('c', 'crop_mode', val);
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                  dropdownStyle={{ background: darkMode ? '#1e293b' : '#ffffff' }}
                  optionLabelProp="children"
                  optionFilterProp="children"
                >
                  <Select.Option value="" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>None</Select.Option>
                  <Select.Option value="fill" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Fill</Select.Option>
                  <Select.Option value="scale" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Scale</Select.Option>
                  <Select.Option value="fit" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Fit</Select.Option>
                  <Select.Option value="limit" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Limit</Select.Option>
                  <Select.Option value="mfill" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Mfill</Select.Option>
                  <Select.Option value="lfill" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Lfill</Select.Option>
                  <Select.Option value="mpad" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Mpad</Select.Option>
                  <Select.Option value="crop" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Crop</Select.Option>
                  <Select.Option value="thumb" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Thumb</Select.Option>
                  <Select.Option value="imagga_crop" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Imagga Crop</Select.Option>
                  <Select.Option value="imagga_scale" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Imagga Scale</Select.Option>
                </Select>
                <label htmlFor="cropWidthInput" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>宽度:</label>
                <InputNumber
                  id="cropWidthInput"
                  placeholder="宽度"
                  value={cropWidth}
                  onChange={(val) => {
                    setCropWidth(val);
                    updateTransformation('c', 'width', val);
                  }}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                />
                <label htmlFor="cropHeightInput" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>高度:</label>
                <InputNumber
                  id="cropHeightInput"
                  placeholder="高度"
                  value={cropHeight}
                  onChange={(val) => {
                    setCropHeight(val);
                    updateTransformation('c', 'height', val);
                  }}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                />
                <label htmlFor="cropGravitySelect" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>重力:</label>
                <Select
                  id="cropGravitySelect"
                  value={cropGravity}
                  onChange={(val) => {
                    setCropGravity(val);
                    updateTransformation('c', 'gravity', val);
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                  dropdownStyle={{ background: darkMode ? '#1e293b' : '#ffffff' }}
                  optionLabelProp="children"
                  optionFilterProp="children"
                >
                  <Select.Option value="" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>None</Select.Option>
                  <Select.Option value="auto" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Auto</Select.Option>
                  <Select.Option value="face" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Face</Select.Option>
                  <Select.Option value="faces" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Faces</Select.Option>
                  <Select.Option value="north" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>North</Select.Option>
                  <Select.Option value="north_east" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>North East</Select.Option>
                  <Select.Option value="east" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>East</Select.Option>
                  <Select.Option value="south_east" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>South East</Select.Option>
                  <Select.Option value="south" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>South</Select.Option>
                  <Select.Option value="south_west" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>South West</Select.Option>
                  <Select.Option value="west" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>West</Select.Option>
                  <Select.Option value="north_west" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>North West</Select.Option>
                  <Select.Option value="center" style={{ color: darkMode ? '#e2e8f0' : '#334155', background: darkMode ? '#1e293b' : '#ffffff' }}>Center</Select.Option>
                </Select>
              </div>

              <div className="effect-group">
                <label htmlFor="qualitySlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>质量:</label>
                <Slider
                  min={1}
                  max={100}
                  onChange={(val) => {
                    setQuality(val);
                    updateTransformation('q', 'level', val);
                  }}
                  value={typeof quality === 'number' ? quality : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  disabled={qualityAuto}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={1}
                  max={100}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={quality}
                  onChange={(val) => {
                    setQuality(val);
                    updateTransformation('q', 'level', val);
                  }}
                  disabled={qualityAuto}
                />
                <Checkbox
                  id="qualityAutoToggle"
                  checked={qualityAuto}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setQualityAuto(isChecked);
                    if (isChecked) {
                      updateTransformation('q', 'level', 'auto');
                    } else {
                      updateTransformation('q', 'level', quality); // 恢复到手动设置的值
                    }
                  }}
                  style={{ color: darkMode ? '#e2e8f0' : '#334155' }}
                >
                  自动
                </Checkbox>
              </div>

              <div className="effect-group">
                <label htmlFor="dprSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>DPR:</label>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.1}
                  onChange={(val) => {
                    setDpr(val);
                    updateTransformation('dpr', 'value', val);
                  }}
                  value={typeof dpr === 'number' ? dpr : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  disabled={dprAuto}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0.1}
                  max={5}
                  step={0.1}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={dpr}
                  onChange={(val) => {
                    setDpr(val);
                    updateTransformation('dpr', 'value', val);
                  }}
                  disabled={dprAuto}
                />
                <Checkbox
                  id="dprAutoToggle"
                  checked={dprAuto}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setDprAuto(isChecked);
                    if (isChecked) {
                      updateTransformation('dpr', 'value', 'auto');
                    } else {
                      updateTransformation('dpr', 'value', dpr); // 恢复到手动设置的值
                    }
                  }}
                  style={{ color: darkMode ? '#e2e8f0' : '#334155' }}
                >
                  自动
                </Checkbox>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse 
          defaultActiveKey={['1']} 
          style={{ 
            width: '100%', 
            marginBottom: '20px',
            background: 'transparent'
          }}
          bordered={false}
        >
          <Panel 
            header={<span style={{ color: darkMode ? '#c4b5fd' : '#7e22ce' }}>模糊与像素化</span>} 
            key="1"
            style={{ background: 'transparent' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="blurSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>模糊强度:</label>
                <Slider
                  min={0}
                  max={2000}
                  onChange={(val) => {
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                  value={typeof blurStrength === 'number' ? blurStrength : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0}
                  max={2000}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={blurStrength}
                  onChange={(val) => {
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="pixelateSlider" style={{ color: darkMode ? '#e2e8f0' : '#334155' }}>像素化强度:</label>
                <Slider
                  min={0}
                  max={200}
                  onChange={(val) => {
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                  value={typeof pixelateStrength === 'number' ? pixelateStrength : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                  trackStyle={{ background: darkMode ? '#a78bfa' : '#7e22ce' }}
                  handleStyle={{ borderColor: darkMode ? '#a78bfa' : '#7e22ce' }}
                />
                <InputNumber
                  min={0}
                  max={200}
                  style={{ margin: '0 10px', width: 80, background: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#334155' }}
                  value={pixelateStrength}
                  onChange={(val) => {
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <Button
                  type={blurFaces ? 'primary' : 'default'}
                  onClick={() => {
                    setBlurFaces(!blurFaces);
                    updateTransformation('e_blur_faces', undefined, !blurFaces);
                  }}
                  className="effect-button"
                >
                  Blur Faces
                </Button>
                <Button
                  type={pixelateFaces ? 'primary' : 'default'}
                  onClick={() => {
                    setPixelateFaces(!pixelateFaces);
                    updateTransformation('e_pixelate_faces', undefined, !pixelateFaces);
                  }}
                  className="effect-button"
                >
                  Pixelate Faces
                </Button>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Space size="middle" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
          <Button type="primary" onClick={handleSaveTransformedImage} className="effect-button">
            保存转换结果
          </Button>
          <Button onClick={handleResetAllEffects} className="effect-button" style={{ background: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#f5f3ff', borderColor: darkMode ? '#7e22ce' : '#8b5cf6', color: darkMode ? '#e9d5ff' : '#7e22ce' }}>
            重置所有效果
          </Button>
        </Space>
      </Space>
    </>
  );
}

export default ImageEditorSection;
