require('@babel/register')({
  presets: [['@babel/preset-env'], ['@babel/preset-typescript']]
});
const { createBadgeTemplate } = require('../src/lib/createBadgeTemplate');

async function run() {
  try {
    await createBadgeTemplate();
    console.log('Badge template generated successfully!');
  } catch (error) {
    console.error('Error generating badge template:', error);
    process.exit(1);
  }
}

run(); 