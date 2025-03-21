import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

// Define badge dimensions and colors
const BADGE_WIDTH = 600;
const BADGE_HEIGHT = 800;
const BADGE_COLOR = '#FECF33'; // Yellow background
const BORDER_COLOR = '#333333';
const BORDER_WIDTH = 10;

export async function createBadgeTemplate() {
  // Create canvas
  const canvas = createCanvas(BADGE_WIDTH, BADGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = BADGE_COLOR;
  ctx.fillRect(0, 0, BADGE_WIDTH, BADGE_HEIGHT);

  // Draw border
  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.strokeRect(BORDER_WIDTH / 2, BORDER_WIDTH / 2, BADGE_WIDTH - BORDER_WIDTH, BADGE_HEIGHT - BORDER_WIDTH);

  // Draw title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SWEATSHOP', BADGE_WIDTH / 2, 150);
  
  // Draw Chinese title
  ctx.font = 'bold 36px Arial';
  ctx.fillText('血汗工厂', BADGE_WIDTH / 2, 200);

  // Draw avatar placeholder circle
  ctx.beginPath();
  ctx.arc(BADGE_WIDTH / 2, 300, 75, 0, Math.PI * 2);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Draw name field
  ctx.fillStyle = '#000000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('NAME :', 100, 500);
  
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 500);
  ctx.lineTo(500, 500);
  ctx.stroke();

  // Draw position field
  ctx.fillStyle = '#000000';
  ctx.font = '30px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('POST :', 100, 550);
  
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 550);
  ctx.lineTo(500, 550);
  ctx.stroke();

  // Draw BNB CHAIN text at bottom
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('BNB CHAIN', BADGE_WIDTH - 30, BADGE_HEIGHT - 30);

  // Create hexagon logo
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

  // Output the image buffer to a file
  const buffer = canvas.toBuffer('image/png');
  const outputDir = path.resolve(process.cwd(), 'public/images');
  
  // Ensure the directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'badge-template.png'), buffer);
  console.log('Badge template created successfully at public/images/badge-template.png');
  
  return buffer;
} 