import { createCanvas, loadImage, Canvas } from 'canvas';
import axios from 'axios';

// 只在服务器端导入 Node.js 模块
let fs: any = null;
let path: any = null;
if (typeof window === 'undefined') {
  // 这个代码块只会在服务器端执行
  fs = require('fs');
  path = require('path');
}

export interface BadgeData {
  name: string;
  avatarUrl: string;
  position?: string;
}

// 默认画布尺寸 - 改为正方形以匹配模板图片比例
const BADGE_WIDTH = 800;
const BADGE_HEIGHT = 800;

// 可调整参数 - 根据新模板调整这些值
const LAYOUT = {
  // 头像参数
  avatar: {
    size: 200,        // 头像大小
    x: 399,           // 头像中心X坐标
    y: 400,           // 头像中心Y坐标
    circleRadius: 80, // 圆形裁剪半径
  },
  // 名字参数
  name: {
    x: 470,          // 名字X坐标
    y: 578,          // 名字Y坐标
    fontSize: 20,    // 名字字体大小
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: 'black',
    align: 'center'  // 对齐方式
  },
  // 职位参数
  position: {
    x: 470,          // 职位X坐标
    y: 658,          // 职位Y坐标
    fontSize: 20,    // 职位字体大小
    fontFamily: 'Arial',
    fontWeight: 'normal',
    color: 'black',
    align: 'center'  // 对齐方式
  }
};

// 为TypeScript声明全局变量，用于临时存储布局
declare global {
  var tempLayout: typeof LAYOUT;
}

export async function generateBadge(badgeData: BadgeData, customLayout?: typeof LAYOUT): Promise<Buffer> {
  console.log('Starting badge generation process...');
  console.log('Avatar URL:', badgeData.avatarUrl);
  
  // 使用提供的自定义布局或全局临时布局或默认布局
  const layout = customLayout || global.tempLayout || LAYOUT;
  
  // 创建画布
  const canvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // 创建一个临时画布用于绘制头像
  const tempCanvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
  const tempCtx = tempCanvas.getContext('2d');
  
  // 加载徽章模板
  try {
    // 获取模板路径 - 根据环境使用不同方式
    let templatePath;
    if (typeof window === 'undefined' && path) {
      // 服务器端
      templatePath = path.join(process.cwd(), 'public/images/badge-template.png');
    } else {
      // 客户端
      templatePath = '/images/badge-template.png';
    }
    
    console.log('Template path:', templatePath);
    
    // 检查文件是否存在仅在服务器端执行
    const templateExists = typeof window === 'undefined' && fs ? fs.existsSync(templatePath) : true;
    console.log('Template exists check:', templateExists);
    
    // GitHub 上的备用模板链接
    const githubTemplateUrl = 'https://raw.githubusercontent.com/lxcong/sweatshop_id_card/master/public/images/badge-template.png';
    
    // 加载图像
    let templateImage;
    if (typeof window === 'undefined') {
      // 服务器端
      try {
        templateImage = await loadImage(templateExists ? templatePath : githubTemplateUrl);
        console.log('Template image loaded from:', templateExists ? 'local file' : 'GitHub');
      } catch (err) {
        console.error('Failed to load template from primary sources, creating basic template');
        // 创建一个基本的模板作为最后的备用选项
        const tempTemplateCanvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
        const tempTemplateCtx = tempTemplateCanvas.getContext('2d');
        
        // 填充黄色背景
        tempTemplateCtx.fillStyle = '#FECF33';
        tempTemplateCtx.fillRect(0, 0, BADGE_WIDTH, BADGE_HEIGHT);
        
        // 添加一些基本文本
        tempTemplateCtx.fillStyle = '#000000';
        tempTemplateCtx.font = 'bold 36px Arial';
        tempTemplateCtx.textAlign = 'center';
        tempTemplateCtx.fillText('SWEATSHOP', BADGE_WIDTH/2, 150);
        
        // 转换为图像
        const tempBuffer = tempTemplateCanvas.toBuffer('image/png');
        templateImage = await loadImage(tempBuffer);
      }
    } else {
      // 客户端
      templateImage = await loadImage(templatePath);
    }
    
    // 加载并在临时画布上绘制用户头像（圆形蒙版）
    try {
      if (!badgeData.avatarUrl || badgeData.avatarUrl === 'undefined') {
        throw new Error('Invalid avatar URL');
      }
      
      console.log('Downloading avatar from:', badgeData.avatarUrl);
      
      // 下载头像图片
      const avatarResponse = await axios.get(badgeData.avatarUrl, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'image/jpeg, image/png, image/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      console.log('Avatar downloaded successfully');
      const avatarImage = await loadImage(Buffer.from(avatarResponse.data, 'binary'));
      console.log('Avatar loaded to canvas');

      // 在临时画布上创建圆形蒙版并绘制头像
      tempCtx.beginPath();
      tempCtx.arc(
        layout.avatar.x, 
        layout.avatar.y, 
        layout.avatar.circleRadius, 
        0, 
        Math.PI * 2, 
        true
      );
      tempCtx.closePath();
      tempCtx.clip();

      // 在圆形蒙版内绘制头像
      tempCtx.drawImage(
        avatarImage,
        layout.avatar.x - layout.avatar.size/2,
        layout.avatar.y - layout.avatar.size/2,
        layout.avatar.size,
        layout.avatar.size
      );
      console.log('Avatar drawn with circular mask');
    } catch (error) {
      console.error('Error loading avatar:', error);
      // 绘制占位头像
      tempCtx.fillStyle = '#808080';
      tempCtx.beginPath();
      tempCtx.arc(
        layout.avatar.x, 
        layout.avatar.y, 
        layout.avatar.circleRadius, 
        0, 
        Math.PI * 2, 
        true
      );
      tempCtx.closePath();
      tempCtx.fill();
    }
      
    // 1. 首先绘制头像到主画布
    ctx.drawImage(tempCanvas, 0, 0);
    
    // 2. 然后绘制背景模板到主画布（这样头像就在模板下方）
    ctx.drawImage(templateImage, 0, 0, BADGE_WIDTH, BADGE_HEIGHT);
    console.log('Template image loaded successfully');
  } catch (err) {
    console.error('Error loading template:', err);
    // 作为后备选项，使用黄色背景
    ctx.fillStyle = '#FECF33';
    ctx.fillRect(0, 0, BADGE_WIDTH, BADGE_HEIGHT);
  }

  // 添加用户名
  ctx.fillStyle = layout.name.color;
  ctx.font = `${layout.name.fontWeight} ${layout.name.fontSize}px ${layout.name.fontFamily}`;
  ctx.textAlign = layout.name.align as CanvasTextAlign;
  ctx.fillText(badgeData.name || 'Unknown User', layout.name.x, layout.name.y);

  // 如果提供了职位则添加
  if (badgeData.position) {
    ctx.fillStyle = layout.position.color;
    ctx.font = `${layout.position.fontWeight} ${layout.position.fontSize}px ${layout.position.fontFamily}`;
    ctx.textAlign = layout.position.align as CanvasTextAlign;
    ctx.fillText(badgeData.position, layout.position.x, layout.position.y);
  }

  console.log('Badge generation completed');
  // 将画布转换为缓冲区
  return canvas.toBuffer('image/png');
}

// 辅助函数：获取Twitter个人资料图片的完整分辨率版本
export function getFullSizeTwitterProfileImage(url: string): string {
  if (!url) return '';
  
  console.log('Original Twitter image URL:', url);
  // 处理null或undefined URL
  if (!url || url === 'undefined') {
    return '';
  }
  
  // 新的Twitter URL格式
  if (url.includes('profile_images')) {
    // 将_normal替换为_400x400或完全删除以获取完整尺寸
    const newUrl = url.replace('_normal', '');
    console.log('Transformed Twitter image URL:', newUrl);
    return newUrl;
  }
  
  console.log('URL was not modified:', url);
  return url;
}

// 导出全局布局配置，以便其他模块可以使用或修改
export const BadgeLayout = LAYOUT; 