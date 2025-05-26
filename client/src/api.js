/**
 * @file API 模块：封装与后端服务器的交互函数
 */

const API_BASE_URL = 'https://kedit-worker.10110531.xyz'; // 自定义域名后端地址

/**
 * 上传图片到 Cloudinary
 * @param {File} imageFile - 要上传的图片文件对象
 * @param {string} [folder='worker_uploads'] - 上传到的 Cloudinary 文件夹名称
 * @param {string[]} [tags=[]] - 图片标签数组
 * @returns {Promise<object>} - 包含上传结果的对象 (public_id, secure_url等)
 * @throws {Error} - 如果上传失败
 */
export async function uploadImage(imageFile, folder = 'worker_uploads', tags = []) {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (folder) {
    formData.append('folder', folder);
  }
  if (tags.length > 0) {
    formData.append('tags', tags.join(',')); // 将标签数组转换为逗号分隔的字符串
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || '图片上传失败');
    }
    return result;
  } catch (error) {
    console.error('上传图片错误:', error);
    throw error;
  }
}

/**
 * 从 Cloudinary 获取图片列表
 * @param {string} [folder=''] - 要获取图片的文件夹名称 (可选)。如果为空，则获取所有上传图片。
 * @param {string} [tag=''] - 可选的标签，用于过滤图片
 * @returns {Promise<object[]>} - 图片数组，每个元素包含 public_id 和 secure_url
 * @throws {Error} - 如果获取失败
 */
export async function fetchImages(folder = '', tag = '') {
  try {
    let url = `${API_BASE_URL}/api/images?folder=${encodeURIComponent(folder)}`;
    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }
    const response = await fetch(url);
    const images = await response.json();

    if (!response.ok) {
      throw new Error(images.error || '获取图片失败');
    }
    return images;
  } catch (error) {
    console.error('获取图片列表错误:', error);
    throw error;
  }
}

/**
 * 根据 public_id 和转换参数生成 Cloudinary 图片 URL
 * @param {string} publicId - 图片的 public ID
 * @param {object} transformations - 包含所有转换效果和参数的对象
 * @returns {Promise<string>} - 转换后图片的 URL
 * @throws {Error} - 如果生成失败
 */
export async function applyTransformations(publicId, transformations) {
  try {
    const queryString = new URLSearchParams({
      public_id: publicId,
      transformations: JSON.stringify(transformations),
    }).toString();

    const response = await fetch(`${API_BASE_URL}/api/transform?${queryString}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '图片转换失败');
    }
    return result.transformed_url;
  } catch (error) {
    console.error('应用转换错误:', error);
    throw error;
  }
}

/**
 * 保存转换后的图片到 Cloudinary
 * @param {string} imageUrl - 转换后图片的 URL
 * @param {string} [folder='worker_uploads'] - 保存到的 Cloudinary 文件夹名称
 * @returns {Promise<object>} - Cloudinary 上传结果
 * @throws {Error} - 如果保存失败
 */
export async function saveTransformedImage(imageUrl, folder = 'worker_uploads') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save-transformed-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, folder }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || '保存转换后图片失败');
    }
    return result;
  } catch (error) {
    console.error('保存转换后图片错误:', error);
    throw error;
  }
}

/**
 * 从 Cloudinary 删除图片
 * @param {string} publicId - 要删除图片的 public ID
 * @returns {Promise<object>} - Cloudinary 删除结果
 * @throws {Error} - 如果删除失败
 */
export async function deleteImage(publicId) {
  try {
    const url = `${API_BASE_URL}/api/delete-image/${encodeURIComponent(publicId)}`;
    console.log('deleteImage API: 发送 DELETE 请求到 URL:', url); // 添加日志
    // 将 public_id 作为路径参数传递
    const response = await fetch(url, {
      method: 'DELETE',
    });

    const result = await response.json();
    console.log('deleteImage API: 接收到响应，状态:', response.status, '结果:', result); // 添加日志

    if (!response.ok) {
      throw new Error(result.error || '删除图片失败');
    }
    return result;
  } catch (error) {
    console.error('删除图片错误:', error);
    throw error;
  }
}
