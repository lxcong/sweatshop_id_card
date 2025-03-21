import { createCanvas, loadImage, Canvas, registerFont } from 'canvas';
import axios from 'axios';

// 只在服务器端导入模块
let sharp: any = null;
let fs: any = null;
let path: any = null;
if (typeof window === 'undefined') {
  // 这些模块只在服务器端加载
  sharp = require('sharp');
  fs = require('fs');
  path = require('path');
  
  // 尝试注册中文字体
  try {
    const fontPaths = {
      regular: path.join(process.cwd(), 'public/fonts/NotoSansSC-Regular.ttf'),
      bold: path.join(process.cwd(), 'public/fonts/NotoSansSC-Bold.ttf')
    };
    
    // 检查字体文件是否存在
    if (fs.existsSync(fontPaths.regular)) {
      registerFont(fontPaths.regular, { family: 'Noto Sans SC', weight: 'normal' });
      console.log('已注册 Noto Sans SC Regular 字体');
    } else {
      console.warn('找不到 Noto Sans SC Regular 字体文件');
    }
    
    if (fs.existsSync(fontPaths.bold)) {
      registerFont(fontPaths.bold, { family: 'Noto Sans SC', weight: 'bold' });
      console.log('已注册 Noto Sans SC Bold 字体');
    } else {
      console.warn('找不到 Noto Sans SC Bold 字体文件');
    }
  } catch (fontError) {
    console.error('字体处理出错:', fontError);
  }
}

// 工具函数：转义SVG文本中的特殊字符
function escapeSvgText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
    x: 460,           // 名字X坐标
    y: 580,           // 名字Y坐标
    fontSize: 20,     // 名字字体大小
    fontFamily: 'sans-serif', // 使用通用无衬线字体
    fontWeight: 'bold',
    color: 'black',
    align: 'center'   // 对齐方式
  },
  // 职位参数
  position: {
    x: 460,           // 职位X坐标
    y: 650,           // 职位Y坐标
    fontSize: 20,     // 职位字体大小
    fontFamily: 'sans-serif', // 使用通用无衬线字体
    fontWeight: 'normal',
    color: 'black',
    align: 'center'   // 对齐方式
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

  // 将画布转换为缓冲区
  const canvasBuffer = canvas.toBuffer('image/png');
  
  // 使用 Sharp 处理图像，添加文字（仅在服务器端）
  if (typeof window === 'undefined' && sharp) {
    try {
      // 创建 SVG 文本图层，添加明确的中文字体回退选项
      const nameText = escapeSvgText(badgeData.name || 'Unknown User');
      const positionText = badgeData.position ? escapeSvgText(badgeData.position) : '';
      
      console.log('Preparing text rendering:');
      console.log('- Name (escaped):', nameText);
      console.log('- Position (escaped):', positionText);
      
      // 中文文本渲染可能在某些环境下出现问题，使用直接图像叠加方法
      console.log('Attempting direct image text overlay with fallback mechanisms');
      
      // 在Canvas上绘制文本
      const textCanvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
      const textCtx = textCanvas.getContext('2d');
      
      // 确保透明背景
      textCtx.clearRect(0, 0, BADGE_WIDTH, BADGE_HEIGHT);
      
      // 尝试几种不同的字体组合来增加成功率
      try {
        // 方法1: 使用Noto Sans SC字体
        textCtx.font = `bold ${layout.name.fontSize}px 'Noto Sans SC', sans-serif`;
        textCtx.textAlign = 'center';
        textCtx.fillStyle = 'black';
        textCtx.fillText(badgeData.name || 'Unknown', layout.name.x, layout.name.y);
        
        // 绘制职位
        if (badgeData.position) {
          textCtx.font = `${layout.position.fontSize}px 'Noto Sans SC', sans-serif`;
          textCtx.fillText(badgeData.position, layout.position.x, layout.position.y);
        }
      } catch (e) {
        // 方法2: 回退到系统字体
        console.log('Fallback to system fonts');
        textCtx.font = `bold ${layout.name.fontSize}px Arial, sans-serif`;
        textCtx.textAlign = 'center';
        textCtx.fillStyle = 'black';
        textCtx.fillText(badgeData.name || 'Unknown', layout.name.x, layout.name.y);
        
        if (badgeData.position) {
          textCtx.font = `${layout.position.fontSize}px Arial, sans-serif`;
          textCtx.fillText(badgeData.position, layout.position.x, layout.position.y);
        }
      }
      
      // 将Canvas转换为Buffer
      const textBuffer = textCanvas.toBuffer('image/png');
      
      // 使用Sharp合成图像
      const finalImage = await sharp(canvasBuffer)
        .composite([{
          input: textBuffer,
          blend: 'over'
        }])
        .png()
        .toBuffer();
      
      console.log('Badge generation completed with optimized Canvas text rendering');
      return finalImage;
    } catch (textError) {
      console.error('Error in primary text rendering method:', textError);
      
      // 最简单的回退方案: 使用基本Canvas
      try {
        console.log('Attempting basic canvas text rendering');
        const textCanvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
        const textCtx = textCanvas.getContext('2d');
        
        // 绘制原始图像
        const baseImage = await loadImage(canvasBuffer);
        textCtx.drawImage(baseImage, 0, 0);
        
        // 使用最基本的字体设置
        textCtx.font = `bold ${layout.name.fontSize}px sans-serif`;
        textCtx.textAlign = 'center';
        textCtx.fillStyle = 'black';
        
        // 逐字符绘制名称以避免编码问题
        const name = badgeData.name || 'Unknown';
        const chars = name.split('');
        let totalWidth = 0;
        
        // 计算总宽度
        for (const char of chars) {
          totalWidth += textCtx.measureText(char).width;
        }
        
        // 从左侧开始的位置
        let currentX = layout.name.x - totalWidth / 2;
        
        // 逐字符绘制
        for (const char of chars) {
          const charWidth = textCtx.measureText(char).width;
          textCtx.fillText(char, currentX + charWidth / 2, layout.name.y);
          currentX += charWidth;
        }
        
        // 如果有职位，也逐字符绘制
        if (badgeData.position) {
          textCtx.font = `${layout.position.fontSize}px sans-serif`;
          
          const posChars = badgeData.position.split('');
          let posTotalWidth = 0;
          
          for (const char of posChars) {
            posTotalWidth += textCtx.measureText(char).width;
          }
          
          let posCurrentX = layout.position.x - posTotalWidth / 2;
          
          for (const char of posChars) {
            const charWidth = textCtx.measureText(char).width;
            textCtx.fillText(char, posCurrentX + charWidth / 2, layout.position.y);
            posCurrentX += charWidth;
          }
        }
        
        console.log('Character-by-character text rendering completed');
        return textCanvas.toBuffer('image/png');
      } catch (fallbackError) {
        console.error('All text rendering methods failed:', fallbackError);
        return canvasBuffer; // 返回不含文本的图像作为最后手段
      }
    }
  } else {
    // 客户端或没有 Sharp 的情况，直接返回 Canvas 生成的缓冲区
    console.log('Badge generation completed without Sharp text rendering (client-side)');
    return canvasBuffer;
  }
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