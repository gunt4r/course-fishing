'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export type HtmlEditorProps = {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  allowFullHtml?: boolean;
};

export default function HtmlEditor({
  value = '',
  onChange,
  placeholder,
  allowFullHtml = true,
}: HtmlEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  useEffect(() => setMounted(true), []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
  ];

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const handleQuillChange = (content: string) => {
    onChange?.(content);
  };

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            isHtmlMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isHtmlMode ? '📝 Visual Editor' : '🔧 HTML Code'}
        </button>
      </div>

      {isHtmlMode ? (
        <div className="border rounded-md overflow-hidden">
          <textarea
            value={value}
            onChange={handleHtmlChange}
            placeholder="Enter HTML code here..."
            className="w-full h-96 p-4 font-mono text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            spellCheck={false}
          />
        </div>
      ) : (
        <div className="quill-wrapper">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleQuillChange}
            modules={modules}
            placeholder={placeholder}
            formats={formats}
            preserveWhitespace={true}
          />
        </div>
      )}

      {allowFullHtml && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-gray-700">
          <p className="font-semibold text-blue-800 mb-1">💡 Pro Tip:</p>
          <p>
            Switch to HTML mode to add custom styles, classes, scripts, or any HTML code. 
            All HTML will be preserved exactly as written.
          </p>
        </div>
      )}
    </div>
  );
}