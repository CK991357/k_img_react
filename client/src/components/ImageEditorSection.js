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
  const [vibrance, setVibrance] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [enhance, setEnhance] = useState(false);

  // 艺术效果状态
  const [cartoonify, setCartoonify] = useState(false);
  const [sepia, setSepia] = useState(false);
  const [vignette, setVignette] = useState(false);
  const [pixelateEffect, setPixelateEffect] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [artFilter, setArtFilter] = useState('');

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
  const [cropGravity, setCropGravity] = useState('');
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
    setVibrance(false);
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
      messageApi.error(`转换失败: ${error.message}`);
    }
  }, [selectedPublicId, originalImageUrl, setTransformedImageUrl, messageApi]);

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

      if (paramName === undefined) {
        if (value === false) {
          delete newTransformations[effectType];
        } else {
          newTransformations[effectType] = {};
        }
      } else {
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
  }, [currentTransformations, selectedPublicId, handleApplyTransformations]);

  /**
   * 保存转换后的图片到 Cloudinary
   * @returns {Promise<void>}
   */
  const handleSaveTransformedImage = async () => {
    if (!selectedPublicId) {
      messageApi.warning('请先从画廊中选择一张图片进行编辑。');
      return;
    }
    if (!transformedImageUrl || transformedImageUrl === originalImageUrl) {
      messageApi.warning('没有转换后的图片可以保存。请先应用转换。');
      return;
    }

    try {
      const folderMatch = selectedPublicId ? selectedPublicId.match(/(.*)\/[^/]+$/) : null;
      const targetFolder = folderMatch ? folderMatch[1] : 'worker_uploads';

      await saveTransformedImage(transformedImageUrl, targetFolder);
      messageApi.success(`转换后图片已成功保存到 Cloudinary 文件夹: ${targetFolder}！`);
      setRefreshGallery(prev => prev + 1);
    } catch (error) {
      messageApi.error(`保存失败: ${error.message}`);
    }
  };

  /**
   * 重置所有效果
   * @returns {void}
   */
  const handleResetAllEffects = () => {
    if (!selectedPublicId) {
      messageApi.warning('请先从画廊中选择一张图片进行编辑。');
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
    setVibrance(false); // 修正为 false
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
    <section>
      {contextHolder}
      <h2 className="section-title-gradient">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        图片编辑
      </h2>
      <Space direction="vertical" size="large" style={{ width: '100%', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M15 8.5C15 10.433 13.433 12 11.5 12C9.567 12 8 10.433 8 8.5C8 6.567 9.567 5 11.5 5C13.433 5 15 6.567 15 8.5Z" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17C2 14.1716 2 12.7574 2.87868 11.8787C3.75736 11 5.17157 11 8 11H15C17.8284 11 19.2426 11 20.1213 11.8787C21 12.7574 21 14.1716 21 17V19C21 20.1046 20.1046 21 19 21H4C2.89543 21 2 20.1046 2 19V17Z" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            原图
          </h3>
          {originalImageUrl ? (
            <Image
              src={originalImageUrl}
              alt="原图"
              className="image-preview-img"
            />
          ) : (
            <div className="image-placeholder">暂无原图</div>
          )}
        </div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M15 8.5C15 10.433 13.433 12 11.5 12C9.567 12 8 10.433 8 8.5C8 6.567 9.567 5 11.5 5C13.433 5 15 6.567 15 8.5Z" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17C2 14.1716 2 12.7574 2.87868 11.8787C3.75736 11 5.17157 11 8 11H15C17.8284 11 19.2426 11 20.1213 11.8787C21 12.7574 21 14.1716 21 17V19C21 20.1046 20.1046 21 19 21H4C2.89543 21 2 20.1046 2 19V17Z" stroke="#6a0dad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            转换后图片
          </h3>
          {transformedImageUrl ? (
            <Image
              src={transformedImageUrl}
              alt="转换后图片"
              className="image-preview-img"
            />
          ) : (
            <div className="image-placeholder">暂无转换后图片</div>
          )}
        </div>
      </Space>

      {/* 颜色调整 */}
      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
        <Panel header="颜色调整" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="brightnessSlider">亮度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                  value={typeof brightness === 'number' ? brightness : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={-100}
                  max={100}
                  value={brightness}
                  onChange={(val) => {
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{brightness}</div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="contrastSlider">对比度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                  value={typeof contrast === 'number' ? contrast : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={-100}
                  max={100}
                  value={contrast}
                  onChange={(val) => {
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{contrast}</div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="saturationSlider">饱和度:</label>
                <Slider
                  min={-100}
                  max={100}
                  onChange={(val) => {
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                  value={typeof saturation === 'number' ? saturation : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={-100}
                  max={100}
                  value={saturation}
                  onChange={(val) => {
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{saturation}</div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="fillLightSlider">补光:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                  value={typeof fillLight === 'number' ? fillLight : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={0}
                  max={100}
                  value={fillLight}
                  onChange={(val) => {
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{fillLight}</div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="fillLightBlendSlider">补光混合:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                  value={typeof fillLightBlend === 'number' ? fillLightBlend : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={0}
                  max={100}
                  value={fillLightBlend}
                  onChange={(val) => {
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{fillLightBlend}</div>
            </div>
          </Space>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
        <Panel header="增强效果" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap className="controls">
              <Button
                className={improve ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setImprove(!improve);
                  updateTransformation('improve', undefined, !improve);
                }}
              >
                Improve
              </Button>
              <Button
                className={autoBrightness ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setAutoBrightness(!autoBrightness);
                  updateTransformation('auto_brightness', undefined, !autoBrightness);
                }}
              >
                Auto Brightness
              </Button>
              <Button
                className={autoColor ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setAutoColor(!autoColor);
                  updateTransformation('auto_color', undefined, !autoColor);
                }}
              >
                Auto Color
              </Button>
              <Button
                className={autoContrast ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setAutoContrast(!autoContrast);
                  updateTransformation('auto_contrast', undefined, !autoContrast);
                }}
              >
                Auto Contrast
              </Button>
              <Button
                className={sharpen ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setSharpen(!sharpen);
                  updateTransformation('sharpen', undefined, !sharpen);
                }}
              >
                Sharpen
              </Button>
              <Button
                className={vibrance ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setVibrance(!vibrance);
                  updateTransformation('e_vibrance', undefined, !vibrance);
                }}
              >
                Vibrance
              </Button>
              <Button
                className={upscale ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setUpscale(!upscale);
                  updateTransformation('upscale', undefined, !upscale);
                }}
              >
                Upscale
              </Button>
              <Button
                className={enhance ? 'effect-button active' : 'effect-button'}
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

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
        <Panel header="艺术效果" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap className="controls">
              <Button
                className={cartoonify ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setCartoonify(!cartoonify);
                  updateTransformation('cartoonify', undefined, !cartoonify);
                }}
              >
                Cartoonify
              </Button>
              <Button
                className={sepia ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setSepia(!sepia);
                  updateTransformation('sepia', undefined, !sepia);
                }}
              >
                Sepia
              </Button>
              <Button
                className={vignette ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setVignette(!vignette);
                  updateTransformation('vignette', undefined, !vignette);
                }}
              >
                Vignette
              </Button>
              <Button
                className={pixelateEffect ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setPixelateEffect(!pixelateEffect);
                  updateTransformation('pixelate', undefined, !pixelateEffect);
                }}
              >
                Pixelate Effect
              </Button>
              <Button
                className={grayscale ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setGrayscale(!grayscale);
                  updateTransformation('grayscale', undefined, !grayscale);
                }}
              >
                Grayscale
              </Button>
            </Space>
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
                className="effect-select"
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

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
        <Panel header="背景与阴影" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap className="controls">
              <Button
                className={removeBackground ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setRemoveBackground(!removeBackground);
                  updateTransformation('remove_background', undefined, !removeBackground);
                }}
              >
                Remove Background
              </Button>
              <Button
                className={shadow ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setShadow(!shadow);
                  updateTransformation('shadow', undefined, !shadow);
                }}
              >
                Shadow
              </Button>
            </Space>
          </Space>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
        <Panel header="不透明度" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="opacitySlider">不透明度:</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                  value={typeof opacity === 'number' ? opacity : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(val) => {
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{opacity}</div>
            </div>
          </Space>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
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
              />
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="replaceColorTolerance">容差 (0-100):</label>
                <Slider
                  min={0}
                  max={100}
                  onChange={(val) => {
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                  value={typeof replaceColorTolerance === 'number' ? replaceColorTolerance : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={0}
                  max={100}
                  value={replaceColorTolerance}
                  onChange={(val) => {
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{replaceColorTolerance}</div>
            </div>
          </Space>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
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
                className="effect-select"
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
                className="effect-select"
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
              />
              <label htmlFor="cropGravitySelect">重力:</label>
              <Select
                id="cropGravitySelect"
                value={cropGravity}
                onChange={(val) => {
                  setCropGravity(val);
                  updateTransformation('c', 'gravity', val);
                }}
                className="effect-select"
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
              <div className="effect-control-row">
                <label htmlFor="qualitySlider">质量:</label>
                <Slider
                  min={1}
                  max={100}
                  onChange={(val) => {
                    setQuality(val);
                    updateTransformation('q', 'level', val);
                  }}
                  value={typeof quality === 'number' ? quality : 0}
                  className="effect-slider"
                  disabled={qualityAuto}
                />
                <InputNumber
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(val) => {
                    setQuality(val);
                    updateTransformation('q', 'level', val);
                  }}
                  disabled={qualityAuto}
                />
              </div>
              <div className="slider-value-display">{quality}</div>
              <Checkbox
                id="qualityAutoToggle"
                checked={qualityAuto}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setQualityAuto(isChecked);
                  if (isChecked) {
                    updateTransformation('q', 'level', 'auto');
                  } else {
                    updateTransformation('q', 'level', quality);
                  }
                }}
              >
                自动
              </Checkbox>
            </div>

            <div className="effect-group">
              <div className="effect-control-row">
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
                  className="effect-slider"
                  disabled={dprAuto}
                />
                <InputNumber
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={dpr}
                  onChange={(val) => {
                    setDpr(val);
                    updateTransformation('dpr', 'value', val);
                  }}
                  disabled={dprAuto}
                />
              </div>
              <div className="slider-value-display">{dpr}</div>
              <Checkbox
                id="dprAutoToggle"
                checked={dprAuto}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setDprAuto(isChecked);
                  if (isChecked) {
                    updateTransformation('dpr', 'value', 'auto');
                  } else {
                    updateTransformation('dpr', 'value', dpr);
                  }
                }}
              >
                自动
              </Checkbox>
            </div>
          </Space>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={['1']} className="ant-collapse-custom">
        <Panel header="模糊与像素化" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="blurSlider">模糊强度:</label>
                <Slider
                  min={0}
                  max={2000}
                  onChange={(val) => {
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                  value={typeof blurStrength === 'number' ? blurStrength : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={0}
                  max={2000}
                  value={blurStrength}
                  onChange={(val) => {
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{blurStrength}</div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="pixelateSlider">像素化强度:</label>
                <Slider
                  min={0}
                  max={200}
                  onChange={(val) => {
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                  value={typeof pixelateStrength === 'number' ? pixelateStrength : 0}
                  className="effect-slider"
                />
                <InputNumber
                  min={0}
                  max={200}
                  value={pixelateStrength}
                  onChange={(val) => {
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                />
              </div>
              <div className="slider-value-display">{pixelateStrength}</div>
            </div>
            <Space wrap className="controls">
              <Button
                className={blurFaces ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setBlurFaces(!blurFaces);
                  updateTransformation('e_blur_faces', undefined, !blurFaces);
                }}
              >
                Blur Faces
              </Button>
              <Button
                className={pixelateFaces ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setPixelateFaces(!pixelateFaces);
                  updateTransformation('e_pixelate_faces', undefined, !pixelateFaces);
                }}
              >
                Pixelate Faces
              </Button>
            </Space>
          </Space>
        </Panel>
      </Collapse>

      <Space size="middle" className="controls" style={{ justifyContent: 'center', marginTop: '20px' }}>
        <Button type="primary" onClick={handleSaveTransformedImage}>
          保存
        </Button>
        <Button onClick={handleResetAllEffects}>
          重置所有效果
        </Button>
      </Space>
    </section>
  );
}

export default ImageEditorSection;
