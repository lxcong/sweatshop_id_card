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
  
  // 尝试注册系统字体，但使用更健壮的方式
  try {
    // 不再尝试注册可能存在问题的字体，直接使用 Canvas 默认字体
    console.log('将使用 Canvas 默认字体');
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
      
      const svgText = `
        <svg width="${BADGE_WIDTH}" height="${BADGE_HEIGHT}">
          <style>
            .name { 
              font: bold 20px "PingFang SC", "Microsoft YaHei", "SimHei", "Noto Sans SC", sans-serif; 
              white-space: pre;
            }
            .position { 
              font: 20px "PingFang SC", "Microsoft YaHei", "SimHei", "Noto Sans SC", sans-serif; 
              white-space: pre;
            }
          </style>
          <text 
            x="${layout.name.x}" 
            y="${layout.name.y}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            class="name" 
            fill="black"
          >${nameText}</text>
          ${positionText ? `
            <text 
              x="${layout.position.x}" 
              y="${layout.position.y}" 
              text-anchor="middle" 
              dominant-baseline="middle"
              class="position" 
              fill="black"
            >${positionText}</text>
          ` : ''}
        </svg>`;
      
      console.log('Created SVG text layer with enhanced Unicode support');
      
      // 使用 Sharp 将文本合成到图像上
      const finalImage = await sharp(canvasBuffer)
        .composite([{
          input: Buffer.from(svgText, 'utf-8'),
          gravity: 'center'
        }])
        .png()
        .toBuffer();
        
      console.log('Badge generation completed with Sharp text rendering');
      return finalImage;
    } catch (textError) {
      console.error('Error rendering text with Sharp:', textError);
      try {
        // 尝试渲染更简单的SVG以便定位问题
        console.log('Attempting simpler SVG text rendering as fallback');
        const simpleSvg = `
          <svg width="${BADGE_WIDTH}" height="${BADGE_HEIGHT}">
            <text x="${layout.name.x}" y="${layout.name.y}" font-family="sans-serif" font-size="20" text-anchor="middle" fill="black">Badge Text</text>
          </svg>`;
        
        const fallbackImage = await sharp(canvasBuffer)
          .composite([{
            input: Buffer.from(simpleSvg, 'utf-8'),
            gravity: 'center'
          }])
          .png()
          .toBuffer();
        
        console.log('Fallback simple text rendering completed');
        return fallbackImage;
      } catch (fallbackError) {
        console.error('Even fallback text rendering failed:', fallbackError);
        // 返回无文本的图像
        console.log('Badge generation completed without text');
        return canvasBuffer;
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