const fs = require('fs');
const path = require('path');
const https = require('https');

// 要下载的字体列表
const fonts = [
  // Google Noto Sans SC中文字体 (Regular)
  {
    url: 'https://fonts.gstatic.com/s/notosanssc/v26/k3kXo84MPvpLmixcA63oeALhLOCT-xWNm8Hqd37g1OkDRZe7lR4sg1IzSy-MNbE9VH8V.ttf',
    path: '../public/fonts/NotoSansSC-Regular.ttf',
    name: 'Noto Sans SC Regular'
  },
  // Google Noto Sans SC中文字体 (Bold)
  {
    url: 'https://fonts.gstatic.com/s/notosanssc/v26/k3kIo84MPvpLmixcA63oeALh7uCPWdvcIU-Lqn3-Of1VSuT2v68.ttf',
    path: '../public/fonts/NotoSansSC-Bold.ttf',
    name: 'Noto Sans SC Bold'
  }
];

// 确保字体目录存在
const fontDir = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

console.log('开始下载中文字体...');

// 创建下载函数
function downloadFont(font) {
  return new Promise((resolve, reject) => {
    const fontPath = path.join(__dirname, font.path);
    const file = fs.createWriteStream(fontPath);
    
    https.get(font.url, function(response) {
      response.pipe(file);
      
      file.on('finish', function() {
        file.close(() => {
          console.log(`${font.name} 已成功下载到 ${fontPath}`);
          resolve();
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(fontPath, () => {});
        console.error(`下载 ${font.name} 时出错:`, err.message);
        reject(err);
      });
    }).on('error', function(err) {
      fs.unlink(fontPath, () => {});
      console.error(`下载 ${font.name} 时出错:`, err.message);
      reject(err);
    });
  });
}

// 创建字体CSS文件
function createFontCSS() {
  const cssContent = `
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/NotoSansSC-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 700;
  src: url('/fonts/NotoSansSC-Bold.ttf') format('truetype');
}
  `;
  
  fs.writeFileSync(path.join(__dirname, '../public/fonts/fonts.css'), cssContent);
  console.log('字体CSS文件已创建在 public/fonts/fonts.css');
}

// 下载所有字体
Promise.all(fonts.map(downloadFont))
  .then(() => {
    console.log('所有字体下载完成！');
    createFontCSS();
    
    // 输出注册字体的Node代码供参考
    console.log('\n在Canvas中注册字体的示例代码:');
    console.log(`
const { registerFont } = require('canvas');
const path = require('path');

// 注册下载的字体
registerFont(path.join(__dirname, '../public/fonts/NotoSansSC-Regular.ttf'), { 
  family: 'Noto Sans SC', 
  weight: 'normal' 
});
registerFont(path.join(__dirname, '../public/fonts/NotoSansSC-Bold.ttf'), { 
  family: 'Noto Sans SC', 
  weight: 'bold' 
});
    `);
  })
  .catch(err => {
    console.error('字体下载过程中出错:', err);
    process.exit(1);
  }); 