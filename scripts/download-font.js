const fs = require('fs');
const path = require('path');
const https = require('https');

// 下载Noto Sans SC字体，这是Google开源的中文字体
const fontUrl = 'https://fonts.gstatic.com/s/notosanssc/v26/k3kXo84MPvpLmixcA63oeALhLOCT-xWNm8Hqd37g1OkDRZe7lR4sg1IzSy-MNbE9VH8V.ttf';
const fontPath = path.join(__dirname, '../public/fonts/NotoSansSC-Regular.ttf');

// 确保字体目录存在
const fontDir = path.dirname(fontPath);
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

console.log('下载中文字体中...');

// 下载字体文件
const file = fs.createWriteStream(fontPath);
https.get(fontUrl, function(response) {
  response.pipe(file);
  
  file.on('finish', function() {
    file.close(() => {
      console.log(`字体已成功下载到 ${fontPath}`);
    });
  });
}).on('error', function(err) {
  fs.unlink(fontPath, () => {}); // 删除不完整的文件
  console.error('下载字体时出错:', err.message);
}); 