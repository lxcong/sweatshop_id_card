"use client";

import { useState, useEffect } from 'react';
import { BadgeLayout } from '@/lib/imageProcessor';
import Image from 'next/image';

export default function LayoutEditor() {
  const [layout, setLayout] = useState(() => {
    // 在客户端组件中复制一份布局配置
    return JSON.parse(JSON.stringify(BadgeLayout));
  });
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState({
    name: 'MICHAEL',
    position: 'TP 志愿者'
  });

  const updateLayout = (section: string, param: string, value: any) => {
    const newLayout = { ...layout };
    // @ts-ignore
    newLayout[section][param] = value;
    setLayout(newLayout);
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/preview-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          layout,
          previewData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const blob = await response.blob();
      if (badgeUrl) {
        URL.revokeObjectURL(badgeUrl);
      }
      const url = URL.createObjectURL(blob);
      setBadgeUrl(url);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 获取布局配置代码
  const getLayoutCode = () => {
    return JSON.stringify(layout, null, 2);
  };

  useEffect(() => {
    return () => {
      if (badgeUrl) {
        URL.revokeObjectURL(badgeUrl);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">徽章布局调整工具</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">预览设置</h2>
            <div className="mb-4">
              <label className="block mb-2">名字:</label>
              <input
                type="text"
                value={previewData.name}
                onChange={(e) => setPreviewData({...previewData, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">职位:</label>
              <input
                type="text"
                value={previewData.position}
                onChange={(e) => setPreviewData({...previewData, position: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={generatePreview}
              disabled={isGenerating}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isGenerating ? '生成中...' : '生成预览'}
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">头像设置</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">X坐标:</label>
                <input
                  type="number"
                  value={layout.avatar.x}
                  onChange={(e) => updateLayout('avatar', 'x', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Y坐标:</label>
                <input
                  type="number"
                  value={layout.avatar.y}
                  onChange={(e) => updateLayout('avatar', 'y', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">大小:</label>
                <input
                  type="number"
                  value={layout.avatar.size}
                  onChange={(e) => updateLayout('avatar', 'size', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">圆形半径:</label>
                <input
                  type="number"
                  value={layout.avatar.circleRadius}
                  onChange={(e) => updateLayout('avatar', 'circleRadius', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">名字设置</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">X坐标:</label>
                <input
                  type="number"
                  value={layout.name.x}
                  onChange={(e) => updateLayout('name', 'x', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Y坐标:</label>
                <input
                  type="number"
                  value={layout.name.y}
                  onChange={(e) => updateLayout('name', 'y', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">字体大小:</label>
                <input
                  type="number"
                  value={layout.name.fontSize}
                  onChange={(e) => updateLayout('name', 'fontSize', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">颜色:</label>
                <input
                  type="text"
                  value={layout.name.color}
                  onChange={(e) => updateLayout('name', 'color', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">对齐方式:</label>
                <select
                  value={layout.name.align}
                  onChange={(e) => updateLayout('name', 'align', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">职位设置</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">X坐标:</label>
                <input
                  type="number"
                  value={layout.position.x}
                  onChange={(e) => updateLayout('position', 'x', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Y坐标:</label>
                <input
                  type="number"
                  value={layout.position.y}
                  onChange={(e) => updateLayout('position', 'y', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">字体大小:</label>
                <input
                  type="number"
                  value={layout.position.fontSize}
                  onChange={(e) => updateLayout('position', 'fontSize', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">颜色:</label>
                <input
                  type="text"
                  value={layout.position.color}
                  onChange={(e) => updateLayout('position', 'color', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">对齐方式:</label>
                <select
                  value={layout.position.align}
                  onChange={(e) => updateLayout('position', 'align', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-4 rounded shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">预览</h2>
            <div className="flex justify-center mb-4">
              {badgeUrl ? (
                <div className="relative w-[300px] h-[400px] mb-4 border border-gray-200 rounded">
                  <Image src={badgeUrl} alt="Badge Preview" fill className="object-contain" />
                </div>
              ) : (
                <div className="w-[300px] h-[400px] bg-gray-200 rounded flex items-center justify-center">
                  点击"生成预览"查看效果
                </div>
              )}
            </div>
            
            <h3 className="font-bold mt-8 mb-2">布局配置代码:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-[400px]">
              {getLayoutCode()}
            </pre>
            
            <div className="mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(getLayoutCode())}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                复制配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 