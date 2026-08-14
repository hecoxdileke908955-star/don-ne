'use client';

import React, { useState } from 'react';
import { SectionData } from '@/lib/section-schema';
import { DynamicSectionRenderer } from './sections/DynamicSectionRenderer';

interface VisualEditorProps {
  pageTitle: string;
  initialSections: SectionData[];
  onSavePublished: (sections: SectionData[]) => void;
}

export const VisualPageEditor: React.FC<VisualEditorProps> = ({
  pageTitle,
  initialSections,
  onSavePublished,
}) => {
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDirty, setIsDirty] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedSection = sections[selectedSectionIdx];

  const handleUpdateProp = (key: string, value: unknown) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[selectedSectionIdx] = {
        ...updated[selectedSectionIdx],
        props: {
          ...updated[selectedSectionIdx].props,
          [key]: value,
        },
      };
      return updated;
    });
    setIsDirty(true);
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
    setSelectedSectionIdx(targetIdx);
    setIsDirty(true);
  };

  const handleToggleVisible = (idx: number) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], visible: !updated[idx].visible };
      return updated;
    });
    setIsDirty(true);
  };

  const handlePublish = () => {
    onSavePublished(sections);
    setIsDirty(false);
    setNotification('Đã xuất bản (Publish) snapshot phiên bản mới thành công!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex h-screen flex-col bg-surface-secondary text-text-main">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
            VISUAL EDITOR
          </span>
          <h2 className="text-sm font-semibold text-text-main">
            Trang: {pageTitle} {isDirty && <span className="text-amber-600 font-normal">(Chưa xuất bản)</span>}
          </h2>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 rounded-ctrl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              deviceMode === 'desktop' ? 'bg-white shadow text-primary font-bold' : 'text-text-muted'
            }`}
          >
            Desktop (100%)
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              deviceMode === 'tablet' ? 'bg-white shadow text-primary font-bold' : 'text-text-muted'
            }`}
          >
            Tablet (768px)
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              deviceMode === 'mobile' ? 'bg-white shadow text-primary font-bold' : 'text-text-muted'
            }`}
          >
            Mobile (390px)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {notification && (
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
              {notification}
            </span>
          )}
          <button
            onClick={handlePublish}
            className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white shadow hover:bg-primary-hover transition"
          >
            XUẤT BẢN (PUBLISH)
          </button>
        </div>
      </header>

      {/* 3-Column Visual Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Section Structure List */}
        <aside className="w-64 border-r border-gray-200 bg-white p-3 flex flex-col justify-between">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
              Cây Section ({sections.length})
            </h4>
            <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSectionIdx(idx)}
                  className={`flex items-center justify-between rounded-ctrl p-2 text-xs transition cursor-pointer ${
                    selectedSectionIdx === idx
                      ? 'border border-primary bg-primary-soft font-bold text-primary'
                      : 'border border-gray-100 bg-gray-50 text-text-main hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] text-text-muted font-mono">#{idx + 1}</span>
                    <span className="truncate">{sec.type}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(idx, 'up');
                      }}
                      disabled={idx === 0}
                      className="text-text-muted hover:text-text-main disabled:opacity-20 px-0.5"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(idx, 'down');
                      }}
                      disabled={idx === sections.length - 1}
                      className="text-text-muted hover:text-text-main disabled:opacity-20 px-0.5"
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisible(idx);
                      }}
                      className="text-text-muted hover:text-text-main px-0.5"
                    >
                      {sec.visible ? '👁' : '🚫'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100 text-[10px] text-text-muted text-center">
            Structure Clean: No Arbitrary HTML
          </div>
        </aside>

        {/* Center: Live Preview Frame */}
        <main className="flex flex-1 items-center justify-center bg-gray-100 p-4 overflow-auto">
          <div
            className={`transition-all duration-300 bg-white shadow-xl rounded-card overflow-hidden border border-gray-300 ${
              deviceMode === 'mobile'
                ? 'w-[390px] h-[780px] overflow-y-auto'
                : deviceMode === 'tablet'
                ? 'w-[768px] h-[850px] overflow-y-auto'
                : 'w-full h-full overflow-y-auto'
            }`}
          >
            <DynamicSectionRenderer sections={sections} />
          </div>
        </main>

        {/* Right Column: Section Properties Panel */}
        <aside className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
          {selectedSection ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase">Thuộc tính Block</span>
                  <h3 className="text-sm font-bold text-text-main">{selectedSection.type}</h3>
                </div>
                <button
                  onClick={() => handleToggleVisible(selectedSectionIdx)}
                  className="text-xs text-primary font-semibold"
                >
                  {selectedSection.visible ? 'Đang hiển thị' : 'Đang ẩn'}
                </button>
              </div>

              {/* Dynamic Prop Form */}
              <div className="space-y-3.5 text-xs">
                {Object.entries(selectedSection.props).map(([propKey, propVal]) => {
                  if (typeof propVal === 'string') {
                    return (
                      <div key={propKey}>
                        <label className="block text-text-main font-medium capitalize mb-1">
                          {propKey}
                        </label>
                        <input
                          type="text"
                          value={propVal}
                          onChange={(e) => handleUpdateProp(propKey, e.target.value)}
                          className="w-full rounded-ctrl border border-gray-300 px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none"
                        />
                      </div>
                    );
                  }
                  if (typeof propVal === 'boolean') {
                    return (
                      <div key={propKey} className="flex items-center justify-between py-1">
                        <label className="text-text-main font-medium capitalize">{propKey}</label>
                        <input
                          type="checkbox"
                          checked={propVal}
                          onChange={(e) => handleUpdateProp(propKey, e.target.checked)}
                          className="h-4 w-4 rounded text-primary"
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-text-muted py-10">
              Chọn một section ở cây bên trái để tùy biến thuộc tính.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
