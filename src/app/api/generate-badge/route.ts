import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { generateBadge, getFullSizeTwitterProfileImage, BadgeLayout } from '@/lib/imageProcessor';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to access this endpoint' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { position, layout, name: customName } = data;

    // Get user data from session
    const { image } = session.user;
    const name = customName || session.user.name; // 使用自定义名字或默认使用推特名
    
    if (!name || !image) {
      return NextResponse.json(
        { error: 'User profile is incomplete' },
        { status: 400 }
      );
    }

    console.log('Generating badge for:', name, image);

    // Generate badge
    const badgeBuffer = await generateBadge({
      name,
      avatarUrl: getFullSizeTwitterProfileImage(image),
      position: position || 'TP 志愿者', // Default position if not provided
    }, layout || global.tempLayout || undefined);

    // Return the image as a response
    return new NextResponse(badgeBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="sweatshop-badge.png"',
      },
    });
  } catch (error) {
    console.error('Error generating badge:', error);
    return NextResponse.json(
      { error: 'Failed to generate badge' },
      { status: 500 }
    );
  }
} 