const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 定义徽章尺寸和颜色
const BADGE_WIDTH = 600;
const BADGE_HEIGHT = 800;
const BADGE_COLOR = '#FECF33'; // 黄色背景
const BORDER_COLOR = '#333333';
const BORDER_WIDTH = 10;

async function createBadgeTemplate() {
  // 创建画布
  const canvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  // 绘制背景
  ctx.fillStyle = BADGE_COLOR;
  ctx.fillRect(0, 0, BADGE_WIDTH, BADGE_HEIGHT);

  // 绘制边框
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeRect(BORDER_WIDTH / 2, BORDER_WIDTH / 2, BADGE_WIDTH - BORDER_WIDTH, BADGE_HEIGHT - BORDER_WIDTH);

  // 绘制标题
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SWEATSHOP', BADGE_WIDTH / 2, 150);
  
  // 绘制中文标题
  ctx.font = 'bold 36px Arial';
  ctx.fillText('血汗工厂', BADGE_WIDTH / 2, 200);

  // 绘制头像占位圆圈
  ctx.beginPath();
  ctx.arc(BADGE_WIDTH / 2, 300, 75, 0, Math.PI * 2);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.stroke();

  // 绘制姓名栏
  ctx.fillStyle = '#000000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('NAME :', 100, 500);
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 500);
  ctx.lineTo(500, 500);
  ctx.stroke();

  // 绘制职位栏
  ctx.fillStyle = '#000000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('POST :', 100, 550);
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 550);
  ctx.lineTo(500, 550);
  ctx.stroke();

  // 底部绘制 BNB CHAIN 文本
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('BNB CHAIN', BADGE_WIDTH - 30, BADGE_HEIGHT - 30);

  // 创建六边形Logo
  const hexagonSize = 60;
  const hexX = BADGE_WIDTH / 2 + 120;
  const hexY = 300;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = hexX + hexagonSize * Math.cos(angle);
    const y = hexY + hexagonSize * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // 输出图像缓冲区到文件
  const buffer = canvas.toBuffer('image/png');
  const outputDir = path.resolve(process.cwd(), 'public/images');
  
  // 确保目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'badge-template.png'), buffer);
  console.log('徽章模板成功创建在 public/images/badge-template.png');
  
  return buffer;
}

// 执行函数
createBadgeTemplate().catch(err => {
  console.error('生成模板时出错:', err);
  process.exit(1);
}); 