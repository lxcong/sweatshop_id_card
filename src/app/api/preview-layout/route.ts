import { NextRequest, NextResponse } from 'next/server';
import { generateBadge } from '@/lib/imageProcessor';

const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/300'; // 使用免费的占位头像服务

export async function POST(req: NextRequest) {
  try {
    const { layout, previewData } = await req.json();
    
    // 保存当前布局到临时变量，便于测试
    global.tempLayout = layout;
    
    // 生成徽章图像
    const badgeBuffer = await generateBadge({
      name: previewData.name || 'MICHAEL',
      avatarUrl: DEFAULT_AVATAR_URL,
      position: previewData.position || 'TP 志愿者',
    }, layout);

    // 返回图像作为响应
    return new NextResponse(badgeBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error generating layout preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate layout preview' },
      { status: 500 }
    );
  }
} 