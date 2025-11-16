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
};

export default function HtmlEditor({
  value = '',
  onChange,
  placeholder,
}: HtmlEditorProps) {
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        formats={formats}
      />
    </div>
  );
}
