import { message } from 'antd'; // 暂时保留 message，后续根据需要移除
import { useCallback, useEffect, useState } from 'react';
import { applyTransformations, saveTransformedImage } from '../api';

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
          <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="var(--button-text-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16V12" stroke="var(--button-text-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="var(--button-text-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        图片编辑
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M15 8.5C15 10.433 13.433 12 11.5 12C9.567 12 8 10.433 8 8.5C8 6.567 9.567 5 11.5 5C13.433 5 15 6.567 15 8.5Z" stroke="var(--heading-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17C2 14.1716 2 12.7574 2.87868 11.8787C3.75736 11 5.17157 11 8 11H15C17.8284 11 19.2426 11 20.1213 11.8787C21 12.7574 21 14.1716 21 17V19C21 20.1046 20.1046 21 19 21H4C2.89543 21 2 20.1046 2 19V17Z" stroke="var(--heading-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            原图
          </h3>
          {originalImageUrl ? (
            <img
              src={originalImageUrl}
              alt="原图"
              className="image-preview-img"
            />
          ) : (
            <div className="image-placeholder" style={{ color: 'var(--secondary-text-color)' }}>暂无原图</div>
          )}
        </div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M15 8.5C15 10.433 13.433 12 11.5 12C9.567 12 8 10.433 8 8.5C8 6.567 9.567 5 11.5 5C13.433 5 15 6.567 15 8.5Z" stroke="var(--heading-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17C2 14.1716 2 12.7574 2.87868 11.8787C3.75736 11 5.17157 11 8 11H15C17.8284 11 19.2426 11 20.1213 11.8787C21 12.7574 21 14.1716 21 17V19C21 20.1046 20.1046 21 19 21H4C2.89543 21 2 20.1046 2 19V17Z" stroke="var(--heading-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            转换后图片
          </h3>
          {transformedImageUrl ? (
            <img
              src={transformedImageUrl}
              alt="转换后图片"
              className="image-preview-img"
            />
          ) : (
            <div className="image-placeholder" style={{ color: 'var(--secondary-text-color)' }}>暂无转换后图片</div>
          )}
        </div>
      </div>

      {/* 颜色调整 */}
      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">颜色调整</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}> {/* 替换 Space */}
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="brightnessSlider">亮度:</label>
                <input
                  type="range"
                  id="brightnessSlider"
                  min={-100}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                  value={typeof brightness === 'number' ? brightness : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={-100}
                  max={100}
                  value={brightness}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBrightness(val);
                    updateTransformation('e_brightness', 'level', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="contrastSlider">对比度:</label>
                <input
                  type="range"
                  id="contrastSlider"
                  min={-100}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                  value={typeof contrast === 'number' ? contrast : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={-100}
                  max={100}
                  value={contrast}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setContrast(val);
                    updateTransformation('e_contrast', 'level', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="saturationSlider">饱和度:</label>
                <input
                  type="range"
                  id="saturationSlider"
                  min={-100}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                  value={typeof saturation === 'number' ? saturation : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={-100}
                  max={100}
                  value={saturation}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSaturation(val);
                    updateTransformation('e_saturation', 'level', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="fillLightSlider">补光:</label>
                <input
                  type="range"
                  id="fillLightSlider"
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                  value={typeof fillLight === 'number' ? fillLight : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={fillLight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFillLight(val);
                    updateTransformation('e_fill_light', 'level', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="fillLightBlendSlider">补光混合:</label>
                <input
                  type="range"
                  id="fillLightBlendSlider"
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                  value={typeof fillLightBlend === 'number' ? fillLightBlend : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={fillLightBlend}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFillLightBlend(val);
                    updateTransformation('e_fill_light', 'blend', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">增强效果</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }} className="controls"> {/* 替换 Space */}
              <button
                className={improve ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setImprove(!improve);
                  updateTransformation('improve', undefined, !improve);
                }}
              >
                优化
              </button>
              <button
                className={autoBrightness ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setAutoBrightness(!autoBrightness);
                  updateTransformation('auto_brightness', undefined, !autoBrightness);
                }}
              >
                自动亮度
              </button>
              <button
                className={autoColor ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setAutoColor(!autoColor);
                  updateTransformation('auto_color', undefined, !autoColor);
                }}
              >
                自动颜色
              </button>
              <button
                className={autoContrast ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setAutoContrast(!autoContrast);
                  updateTransformation('auto_contrast', undefined, !autoContrast);
                }}
              >
                自动对比度
              </button>
              <button
                className={sharpen ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setSharpen(!sharpen);
                  updateTransformation('sharpen', undefined, !sharpen);
                }}
              >
                锐化
              </button>
              <button
                className={vibrance ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setVibrance(!vibrance);
                  updateTransformation('e_vibrance', undefined, !vibrance);
                }}
              >
                鲜艳度
              </button>
              <button
                className={upscale ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setUpscale(!upscale);
                  updateTransformation('upscale', undefined, !upscale);
                }}
              >
                放大
              </button>
              <button
                className={enhance ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setEnhance(!enhance);
                  updateTransformation('enhance', undefined, !enhance);
                }}
              >
                增强
              </button>
          </div>
        </div>
      </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">艺术效果</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }} className="controls"> {/* 替换 Space */}
              <button
                className={cartoonify ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setCartoonify(!cartoonify);
                  updateTransformation('cartoonify', undefined, !cartoonify);
                }}
              >
                卡通化
              </button>
              <button
                className={sepia ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setSepia(!sepia);
                  updateTransformation('sepia', undefined, !sepia);
                }}
              >
                复古
              </button>
              <button
                className={vignette ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setVignette(!vignette);
                  updateTransformation('vignette', undefined, !vignette);
                }}
              >
                暗角
              </button>
              <button
                className={pixelateEffect ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setPixelateEffect(!pixelateEffect);
                  updateTransformation('pixelate', undefined, !pixelateEffect);
                }}
              >
                像素化
              </button>
              <button
                className={grayscale ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setGrayscale(!grayscale);
                  updateTransformation('grayscale', undefined, !grayscale);
                }}
              >
                灰度
              </button>
            </div>
            <div className="effect-group">
              <label htmlFor="artFilterSelect">艺术滤镜:</label>
              <select
                id="artFilterSelect"
                value={artFilter}
                onChange={(e) => {
                  const val = e.target.value;
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
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              >
                <option value="">无</option>
                <option value="al_dente">Al Dente</option>
                <option value="athena">Athena</option>
                <option value="audrey">Audley</option>
                <option value="aurora">Aurora</option>
                <option value="daguerre">Daguerre</option>
                <option value="eucalyptus">Eucalyptus</option>
                <option value="fes">Fes</option>
                <option value="hokusai">Hokusai</option>
                <option value="incognito">Incognito</option>
                <option value="linen">Linen</option>
                <option value="peacock">Peacock</option>
                <option value="primavera">Primavera</option>
                <option value="quartz">Quartz</option>
                <option value="red_rock">Red Rock</option>
                <option value="sizzle">Sizzle</option>
                <option value="sonnet">Sonnet</option>
                <option value="ukiyo">Ukiyo</option>
                <option value="zorro">Zorro</option>
              </select>
            </div>
          </div>
        </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">背景与阴影</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }} className="controls"> {/* 替换 Space */}
              <button
                className={removeBackground ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setRemoveBackground(!removeBackground);
                  updateTransformation('remove_background', undefined, !removeBackground);
                }}
              >
                移除背景
              </button>
              <button
                className={shadow ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setShadow(!shadow);
                  updateTransformation('shadow', undefined, !shadow);
                }}
              >
                阴影
              </button>
            </div>
          </div>
        </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">不透明度</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}> {/* 替换 Space */}
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="opacitySlider">不透明度 (0-100):</label>
                <input
                  type="range"
                  id="opacitySlider"
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                  value={typeof opacity === 'number' ? opacity : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOpacity(val);
                    updateTransformation('o', 'level', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">替换颜色</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}> {/* 替换 Space */}
            <div className="effect-group">
              <label htmlFor="replaceColorFrom">原色:</label>
              <input
                type="text"
                id="replaceColorFrom"
                placeholder="例如: red 或 #FF0000"
                value={replaceColorFrom}
                onChange={(e) => {
                  const val = e.target.value;
                  setReplaceColorFrom(val);
                  updateTransformation('e_replace_color', 'from_color', val);
                }}
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              />
            </div>
            <div className="effect-group">
              <label htmlFor="replaceColorTo">目标颜色:</label>
              <input
                type="text"
                id="replaceColorTo"
                placeholder="例如: blue 或 #0000FF"
                value={replaceColorTo}
                onChange={(e) => {
                  const val = e.target.value;
                  setReplaceColorTo(val);
                  updateTransformation('e_replace_color', 'to_color', val);
                }}
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              />
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="replaceColorTolerance">容差 (0-100):</label>
                <input
                  type="range"
                  id="replaceColorTolerance"
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                  value={typeof replaceColorTolerance === 'number' ? replaceColorTolerance : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={replaceColorTolerance}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setReplaceColorTolerance(val);
                    updateTransformation('e_replace_color', 'tolerance', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">图像转换</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}> {/* 替换 Space */}
            <div className="effect-group">
              <label htmlFor="formatSelect">格式转换:</label>
              <select
                id="formatSelect"
                value={format}
                onChange={(e) => {
                  const val = e.target.value;
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
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              >
                <option value="">选择格式</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
                <option value="tiff">TIFF</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div className="effect-group">
              <label htmlFor="cropModeSelect">模式:</label>
              <select
                id="cropModeSelect"
                value={cropMode}
                onChange={(e) => {
                  const val = e.target.value;
                  setCropMode(val);
                  updateTransformation('c', 'crop_mode', val);
                }}
                className="effect-select"
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              >
                <option value="">选择模式</option>
                <option value="fill">Fill</option>
                <option value="scale">Scale</option>
                <option value="fit">Fit</option>
                <option value="limit">Limit</option>
                <option value="mfill">Mfill</option>
                <option value="lfill">Lfill</option>
                <option value="mpad">Mpad</option>
                <option value="crop">Crop</option>
                <option value="thumb">Thumb</option>
                <option value="imagga_crop">Imagga Crop</option>
                <option value="imagga_scale">Imagga Scale</option>
              </select>
              <label htmlFor="cropWidthInput">宽度:</label>
              <input
                type="number"
                id="cropWidthInput"
                placeholder="宽度"
                value={cropWidth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCropWidth(val);
                  updateTransformation('c', 'width', val);
                }}
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              />
              <label htmlFor="cropHeightInput">高度:</label>
              <input
                type="number"
                id="cropHeightInput"
                placeholder="高度"
                value={cropHeight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCropHeight(val);
                  updateTransformation('c', 'height', val);
                }}
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              />
              <label htmlFor="cropGravitySelect">重力:</label>
              <select
                id="cropGravitySelect"
                value={cropGravity}
                onChange={(e) => {
                  const val = e.target.value;
                  setCropGravity(val);
                  updateTransformation('c', 'gravity', val);
                }}
                className="effect-select"
                style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
              >
                <option value="">无 (默认)</option>
                <option value="auto">Auto</option>
                <option value="face">Face</option>
                <option value="faces">Faces</option>
                <option value="north">North</option>
                <option value="north_east">North East</option>
                <option value="east">East</option>
                <option value="south_east">South East</option>
                <option value="south">South</option>
                <option value="south_west">South West</option>
                <option value="west">West</option>
                <option value="north_west">North West</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="qualitySlider">质量 (1-100):</label>
                <input
                  type="range"
                  id="qualitySlider"
                  min={1}
                  max={100}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQuality(val);
                    updateTransformation('q', 'level', val);
                  }}
                  value={typeof quality === 'number' ? quality : 0}
                  className="effect-slider"
                  disabled={qualityAuto}
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQuality(val);
                    updateTransformation('q', 'level', val);
                  }}
                  disabled={qualityAuto}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
              <label htmlFor="qualityAutoToggle" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--secondary-text-color)' }}>
                <input
                  type="checkbox"
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
                />
                自动质量 (q_auto)
              </label>
            </div>

            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="dprSlider">DPR:</label>
                <input
                  type="range"
                  id="dprSlider"
                  min={0.1}
                  max={5}
                  step={0.1}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDpr(val);
                    updateTransformation('dpr', 'value', val);
                  }}
                  value={typeof dpr === 'number' ? dpr : 0}
                  className="effect-slider"
                  disabled={dprAuto}
                />
                <input
                  type="number"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={dpr}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDpr(val);
                    updateTransformation('dpr', 'value', val);
                  }}
                  disabled={dprAuto}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
              <label htmlFor="dprAutoToggle" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'var(--secondary-text-color)' }}>
                <input
                  type="checkbox"
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
                />
                自动DPR (dpr_auto)
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-collapse"> {/* 替换 Collapse */}
        <div className="custom-collapse-header">模糊与像素化</div> {/* 替换 Panel header */}
        <div className="custom-collapse-content-box"> {/* 替换 Panel content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}> {/* 替换 Space */}
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="blurSlider">模糊强度:</label>
                <input
                  type="range"
                  id="blurSlider"
                  min={0}
                  max={2000}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                  value={typeof blurStrength === 'number' ? blurStrength : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={0}
                  max={2000}
                  value={blurStrength}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBlurStrength(val);
                    updateTransformation('e_blur', 'strength', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
            <div className="effect-group">
              <div className="effect-control-row">
                <label htmlFor="pixelateSlider">像素化强度:</label>
                <input
                  type="range"
                  id="pixelateSlider"
                  min={0}
                  max={200}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                  value={typeof pixelateStrength === 'number' ? pixelateStrength : 0}
                  className="effect-slider"
                />
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={pixelateStrength}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPixelateStrength(val);
                    updateTransformation('e_pixelate', 'strength', val);
                  }}
                  style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', borderColor: 'var(--input-border-color)' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }} className="controls"> {/* 替换 Space */}
              <button
                className={blurFaces ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setBlurFaces(!blurFaces);
                  updateTransformation('e_blur_faces', undefined, !blurFaces);
                }}
              >
                模糊人脸
              </button>
              <button
                className={pixelateFaces ? 'effect-button active' : 'effect-button'}
                onClick={() => {
                  setPixelateFaces(!pixelateFaces);
                  updateTransformation('e_pixelate_faces', undefined, !pixelateFaces);
                }}
              >
                像素化人脸
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }} className="controls"> {/* 替换 Space */}
        <button type="button" className="ant-btn-primary" onClick={handleSaveTransformedImage}>
          保存
        </button>
        <button type="button" className="ant-btn-primary" onClick={handleResetAllEffects}>
          重置所有效果
        </button>
      </div>
    </section>
  );
}

export default ImageEditorSection;
