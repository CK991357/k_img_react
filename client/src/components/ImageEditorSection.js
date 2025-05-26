import { Button, Checkbox, Collapse, Image, Input, InputNumber, message, Select, Slider, Space } from 'antd';
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
 * @returns {JSX.Element} - 图片编辑部分的 JSX 元素
 */
function ImageEditorSection({ selectedPublicId, originalImageUrl, setRefreshGallery, setSelectedPublicId, setOriginalImageUrl }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [transformedImageUrl, setTransformedImageUrl] = useState(null);
  const [currentTransformations, setCurrentTransformations] = useState({}); // 用于存储当前应用的所有转换效果及其参数

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
    setVibrance(0);
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
      {contextHolder} {/* 渲染 contextHolder */}
      <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
        <h2>图片编辑</h2>
        <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>原图</h3>
            <Image
              src={originalImageUrl || ''}
              alt="原图"
              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', border: '1px solid #f0f0f0' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Placeholder for Ant Design Image
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3>转换后图片</h3>
            <Image
              src={transformedImageUrl || ''}
              alt="转换后图片"
              style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain', border: '1px solid #f0f0f0' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Placeholder for Ant Design Image
            />
          </div>
        </Space>

        {/* 颜色调整 */}
        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="颜色调整" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="brightnessSlider">亮度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                  value={typeof brightness === 'number' ? brightness : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={-100}
                  max={100}
                  style={{ margin: '0 10px' }}
                  value={brightness}
                  onChange={(val) => {
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="contrastSlider">对比度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                  value={typeof contrast === 'number' ? contrast : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={-100}
                  max={100}
                  style={{ margin: '0 10px' }}
                  value={contrast}
                  onChange={(val) => {
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="saturationSlider">饱和度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                  value={typeof saturation === 'number' ? saturation : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={-100}
                  max={100}
                  style={{ margin: '0 10px' }}
                  value={saturation}
                  onChange={(val) => {
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="fillLightSlider">补光:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                  value={typeof fillLight === 'number' ? fillLight : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px' }}
                  value={fillLight}
                  onChange={(val) => {
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="fillLightBlendSlider">补光混合:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                  value={typeof fillLightBlend === 'number' ? fillLightBlend : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px' }}
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

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="增强效果" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* 第一行增强效果按钮 */}
              <Space wrap>
                <Button
                  type={improve ? 'primary' : 'default'}
                  onClick={() => {
                    setImprove(!improve);
                    updateTransformation('improve', undefined, !improve);
                  }}
                >
                  Improve
                </Button>
                <Button
                  type={autoBrightness ? 'primary' : 'default'}
                  onClick={() => {
                    setAutoBrightness(!autoBrightness);
                    updateTransformation('auto_brightness', undefined, !autoBrightness);
                  }}
                >
                  Auto Brightness
                </Button>
                <Button
                  type={autoColor ? 'primary' : 'default'}
                  onClick={() => {
                    setAutoColor(!autoColor);
                    updateTransformation('auto_color', undefined, !autoColor);
                  }}
                >
                  Auto Color
                </Button>
                <Button
                  type={autoContrast ? 'primary' : 'default'}
                  onClick={() => {
                    setAutoContrast(!autoContrast);
                    updateTransformation('auto_contrast', undefined, !autoContrast);
                  }}
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
                >
                  Sharpen
                </Button>
                <Button
                  type={vibrance ? 'primary' : 'default'}
                  onClick={() => {
                    setVibrance(!vibrance);
                    updateTransformation('e_vibrance', undefined, !vibrance); // 将 vibrance 作为一个无参数效果处理
                  }}
                >
                  Vibrance
                </Button>
                <Button
                  type={upscale ? 'primary' : 'default'}
                  onClick={() => {
                    setUpscale(!upscale);
                    updateTransformation('upscale', undefined, !upscale);
                  }}
                >
                  Upscale
                </Button>
                <Button
                  type={enhance ? 'primary' : 'default'}
                  onClick={() => {
                    setEnhance(!enhance);
                    updateTransformation('enhance', undefined, !enhance);
                  }}
                >
                  Enhance
                </Button>
              </Space>
            </Space>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="艺术效果" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <Button
                  type={cartoonify ? 'primary' : 'default'}
                  onClick={() => {
                    setCartoonify(!cartoonify);
                    updateTransformation('cartoonify', undefined, !cartoonify);
                  }}
                >
                  Cartoonify
                </Button>
                <Button
                  type={sepia ? 'primary' : 'default'}
                  onClick={() => {
                    setSepia(!sepia);
                    updateTransformation('sepia', undefined, !sepia);
                  }}
                >
                  Sepia
                </Button>
                <Button
                  type={vignette ? 'primary' : 'default'}
                  onClick={() => {
                    setVignette(!vignette);
                    updateTransformation('vignette', undefined, !vignette);
                  }}
                >
                  Vignette
                </Button>
                <Button
                  type={pixelateEffect ? 'primary' : 'default'}
                  onClick={() => {
                    setPixelateEffect(!pixelateEffect);
                    updateTransformation('pixelate', undefined, !pixelateEffect);
                  }}
                >
                  Pixelate Effect
                </Button>
                <Button
                  type={grayscale ? 'primary' : 'default'}
                  onClick={() => {
                    setGrayscale(!grayscale);
                    updateTransformation('grayscale', undefined, !grayscale);
                  }}
                >
                  Grayscale
                </Button>
              </div>
              <div className="effect-group">
                <label htmlFor="artFilterSelect">Art Filter:</label>
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
                >
                  <Select.Option value="">None</Select.Option>
                  <Select.Option value="al_dente">Al Dente</Select.Option>
                  <Select.Option value="athena">Athena</Select.Option>
                  <Select.Option value="audrey">Audrey</Select.Option>
                  <Select.Option value="aurora">Aurora</Select.Option>
                  <Select.Option value="daguerre">Daguerre</Select.Option>
                  <Select.Option value="eucalyptus">Eucalyptus</Select.Option>
                  <Select.Option value="fes">Fes</Select.Option>
                  <Select.Option value="hokusai">Hokusai</Select.Option>
                  <Select.Option value="incognito">Incognito</Select.Option>
                  <Select.Option value="linen">Linen</Select.Option>
                  <Select.Option value="peacock">Peacock</Select.Option>
                  <Select.Option value="primavera">Primavera</Select.Option>
                  <Select.Option value="quartz">Quartz</Select.Option>
                  <Select.Option value="red_rock">Red Rock</Select.Option>
                  <Select.Option value="sizzle">Sizzle</Select.Option>
                  <Select.Option value="sonnet">Sonnet</Select.Option>
                  <Select.Option value="ukiyo">Ukiyo</Select.Option>
                  <Select.Option value="zorro">Zorro</Select.Option>
                </Select>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="背景与阴影" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <Button
                  type={removeBackground ? 'primary' : 'default'}
                  onClick={() => {
                    setRemoveBackground(!removeBackground);
                    updateTransformation('remove_background', undefined, !removeBackground);
                  }}
                >
                  Remove Background
                </Button>
                <Button
                  type={shadow ? 'primary' : 'default'}
                  onClick={() => {
                    setShadow(!shadow);
                    updateTransformation('shadow', undefined, !shadow);
                  }}
                >
                  Shadow
                </Button>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="不透明度" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="opacitySlider">不透明度:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                  value={typeof opacity === 'number' ? opacity : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px' }}
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

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="替换颜色" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="replaceColorFrom">源颜色 (Hex):</label>
                <Input
                  id="replaceColorFrom"
                  placeholder="#RRGGBB 或 color_name"
                  value={replaceColorFrom}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReplaceColorFrom(val);
                    updateTransformation('e_replace_color', 'from_color', val);
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="replaceColorTo">目标颜色 (Hex):</label>
                <Input
                  id="replaceColorTo"
                  placeholder="#RRGGBB 或 color_name"
                  value={replaceColorTo}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReplaceColorTo(val);
                    updateTransformation('e_replace_color', 'to_color', val);
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="replaceColorTolerance">容差 (0-100):</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                  value={typeof replaceColorTolerance === 'number' ? replaceColorTolerance : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={0}
                  max={100}
                  style={{ margin: '0 10px' }}
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

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="图像转换" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="formatSelect">格式转换:</label>
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
                >
                  <Select.Option value="">Original</Select.Option>
                  <Select.Option value="jpg">JPG</Select.Option>
                  <Select.Option value="png">PNG</Select.Option>
                  <Select.Option value="webp">WebP</Select.Option>
                  <Select.Option value="gif">GIF</Select.Option>
                  <Select.Option value="bmp">BMP</Select.Option>
                  <Select.Option value="tiff">TIFF</Select.Option>
                  <Select.Option value="pdf">PDF</Select.Option>
                </Select>
              </div>

              <div className="effect-group">
                <label htmlFor="cropModeSelect">裁剪模式:</label>
                <Select
                  id="cropModeSelect"
                  value={cropMode}
                  onChange={(val) => {
                    setCropMode(val);
                    updateTransformation('c', 'crop_mode', val);
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                >
                  <Select.Option value="">None</Select.Option>
                  <Select.Option value="fill">Fill</Select.Option>
                  <Select.Option value="scale">Scale</Select.Option>
                  <Select.Option value="fit">Fit</Select.Option>
                  <Select.Option value="limit">Limit</Select.Option>
                  <Select.Option value="mfill">Mfill</Select.Option>
                  <Select.Option value="lfill">Lfill</Select.Option>
                  <Select.Option value="mpad">Mpad</Select.Option>
                  <Select.Option value="crop">Crop</Select.Option>
                  <Select.Option value="thumb">Thumb</Select.Option>
                  <Select.Option value="imagga_crop">Imagga Crop</Select.Option>
                  <Select.Option value="imagga_scale">Imagga Scale</Select.Option>
                </Select>
                <label htmlFor="cropWidthInput">宽度:</label>
                <InputNumber
                  id="cropWidthInput"
                  placeholder="宽度"
                  value={cropWidth}
                  onChange={(val) => {
                    setCropWidth(val);
                    updateTransformation('c', 'width', val);
                  }}
                  style={{ margin: '0 10px' }}
                />
                <label htmlFor="cropHeightInput">高度:</label>
                <InputNumber
                  id="cropHeightInput"
                  placeholder="高度"
                  value={cropHeight}
                  onChange={(val) => {
                    setCropHeight(val);
                    updateTransformation('c', 'height', val);
                  }}
                  style={{ margin: '0 10px' }}
                />
                <label htmlFor="cropGravitySelect">重力:</label>
                <Select
                  id="cropGravitySelect"
                  value={cropGravity}
                  onChange={(val) => {
                    setCropGravity(val);
                    updateTransformation('c', 'gravity', val);
                  }}
                  style={{ flex: 1, margin: '0 10px' }}
                >
                  <Select.Option value="">None</Select.Option>
                  <Select.Option value="auto">Auto</Select.Option>
                  <Select.Option value="face">Face</Select.Option>
                  <Select.Option value="faces">Faces</Select.Option>
                  <Select.Option value="north">North</Select.Option>
                  <Select.Option value="north_east">North East</Select.Option>
                  <Select.Option value="east">East</Select.Option>
                  <Select.Option value="south_east">South East</Select.Option>
                  <Select.Option value="south">South</Select.Option>
                  <Select.Option value="south_west">South West</Select.Option>
                  <Select.Option value="west">West</Select.Option>
                  <Select.Option value="north_west">North West</Select.Option>
                  <Select.Option value="center">Center</Select.Option>
                </Select>
              </div>

              <div className="effect-group">
                <label htmlFor="qualitySlider">质量:</label>
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
                />
                <InputNumber
                  min={1}
                  max={100}
                  style={{ margin: '0 10px' }}
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
                >
                  自动
                </Checkbox>
              </div>

              <div className="effect-group">
                <label htmlFor="dprSlider">DPR:</label>
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
                />
                <InputNumber
                  min={0.1}
                  max={5}
                  step={0.1}
                  style={{ margin: '0 10px' }}
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
                >
                  自动
                </Checkbox>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} style={{ width: '100%', marginBottom: '20px' }}>
          <Panel header="模糊与像素化" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="effect-group">
                <label htmlFor="blurSlider">模糊强度:</label>
                <Slider
                  min={0}
                  max={2000}
                  onChange={(val) => {
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                  value={typeof blurStrength === 'number' ? blurStrength : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={0}
                  max={2000}
                  style={{ margin: '0 10px' }}
                  value={blurStrength}
                  onChange={(val) => {
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                />
              </div>
              <div className="effect-group">
                <label htmlFor="pixelateSlider">像素化强度:</label>
                <Slider
                  min={0}
                  max={200}
                  onChange={(val) => {
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                  value={typeof pixelateStrength === 'number' ? pixelateStrength : 0}
                  style={{ flex: 1, margin: '0 10px' }}
                />
                <InputNumber
                  min={0}
                  max={200}
                  style={{ margin: '0 10px' }}
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
                >
                  Blur Faces
                </Button>
                <Button
                  type={pixelateFaces ? 'primary' : 'default'}
                  onClick={() => {
                    setPixelateFaces(!pixelateFaces);
                    updateTransformation('e_pixelate_faces', undefined, !pixelateFaces);
                  }}
                >
                  Pixelate Faces
                </Button>
              </div>
            </Space>
          </Panel>
        </Collapse>

        <Space size="middle" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
          <Button type="primary" onClick={handleSaveTransformedImage}>
            保存
          </Button>
          <Button onClick={handleResetAllEffects}>
            重置所有效果
          </Button>
        </Space>
      </Space>
    </>
  );
}

export default ImageEditorSection;
