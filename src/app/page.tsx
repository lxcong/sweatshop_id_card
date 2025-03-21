"use client";

import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const [position, setPosition] = useState('TP 志愿者');
  const [isGenerating, setIsGenerating] = useState(false);
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 登录处理
  const handleSignIn = async () => {
    try {
      setError(null);
      await signIn('twitter', { callbackUrl: '/' });
    } catch (err) {
      console.error('登录失败:', err);
      setError('登录过程中出现错误，请重试');
    }
  };

  const handleGenerateBadge = async () => {
    if (!session) {
      setError('请先登录以生成徽章');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('正在生成徽章，用户信息:', {
        name: session.user?.name,
        image: session.user?.image,
        position
      });
      
      const response = await fetch('/api/generate-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成徽章失败');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBadgeUrl(url);
    } catch (error: any) {
      console.error('生成徽章错误:', error);
      setError(error.message || '生成徽章失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 清理资源
  useEffect(() => {
    return () => {
      if (badgeUrl) {
        URL.revokeObjectURL(badgeUrl);
      }
    };
  }, [badgeUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">血汗工厂 SWEATSHOP</h1>
        <h2 className="text-xl md:text-2xl mb-12 text-center">厂友好，帮你做个ID卡</h2>

        {error && (
          <div className="w-full max-w-md mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          {status === 'loading' ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : session ? (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{session.user?.name || 'Twitter用户'}</h3>
                  <p className="text-gray-600 text-sm">
                    已通过Twitter验证 
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      ✓ 已登录
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position (职位)
                </label>
                <input
                  type="text"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full">
                <button
                  onClick={handleGenerateBadge}
                  disabled={isGenerating}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {isGenerating ? '生成中...' : '生成徽章'}
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  退出登录
                </button>
              </div>

              {badgeUrl && (
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative w-72 h-96 mb-4 border border-gray-200 rounded">
                    <Image src={badgeUrl} alt="Generated Badge" fill className="object-contain" />
                  </div>
                  <a
                    href={badgeUrl}
                    download="sweatshop-badge.png"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    下载徽章
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <p className="text-center text-lg mb-4">
                通过Twitter登录，生成属于你的SWEATSHOP工厂ID卡
              </p>
              <button
                onClick={handleSignIn}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 focus:outline-none focus:shadow-outline"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                登录 Twitter
              </button>
              <div className="mt-4 text-sm text-gray-500 text-center">
                我们只使用你的公开资料信息来生成徽章
              </div>
            </div>
          )}
        </div>
        

      </div>
    </main>
  );
}
