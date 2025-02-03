'use client';
import { useState } from 'react';
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { IndentIcon, AlignJustify, ArrowLeft, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import JsonForm from '@/components/JsonForm';
import AdBanner from '@/components/AdBanner';

export default function JsonEditorPage() {
  const [jsonText, setJsonText] = useState('{\n  "hello": "world"\n}');
  const [formData, setFormData] = useState('{\n  "hello": "world"\n}');
  const { theme } = useTheme();

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
    } catch (error) {
      alert('유효하지 않은 JSON 형식입니다.');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
    } catch (error) {
      alert('유효하지 않은 JSON 형식입니다.');
    }
  };

  // Form에서 Editor로 데이터 전송
  const syncToEditor = () => {
    setJsonText(formData);
  };

  // Editor에서 Form으로 데이터 전송
  const syncToForm = () => {
    try {
      // JSON 형식 검증
      const parsed = JSON.parse(jsonText);

      // 객체 타입 검증
      if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
        alert('JSON 데이터는 객체 형식이어야 합니다.');
        return;
      }

      setFormData(jsonText);
    } catch (error) {
      alert('유효하지 않은 JSON 형식입니다.');
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] p-4 lg:ml-0 max-w-full overflow-x-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-4 pl-8 lg:pl-0">JSON Editor</h1>

      <div className="flex flex-col lg:flex-row gap-4 flex-grow min-h-0">
        {/* 왼쪽: JSON 폼 */}
        <div className="flex-1 min-w-0 border rounded-lg shadow-sm h-full min-h-[400px] overflow-auto">
          <div className="bg-muted p-2 border-b flex items-right justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={syncToEditor}
              title="에디터로 복사"
            >
              <ArrowRight className="w-4 h-4 mr-1" />
            </Button>
          </div>
          <JsonForm
            initialJson={formData}
            onChange={setFormData}
          />
        </div>

        {/* 오른쪽: 코드 에디터 */}
        <div className="flex-1 min-w-0 border rounded-lg shadow-sm h-full min-h-[400px]">
          <div className="bg-muted p-2 border-b flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={syncToForm}
                title="구조로 복사"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={formatJson}
                title="JSON 포맷팅"
              >
                <IndentIcon className="w-4 h-4 mr-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={minifyJson}
                title="JSON 압축"
              >
                <AlignJustify className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>
          <div className="h-[calc(100%-40px)]">
            <Editor
              height="100%"
              width="100%"
              defaultLanguage="json"
              value={jsonText}
              onChange={setJsonText}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                formatOnPaste: true,
                formatOnType: true,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* 광고 영역 */}
      <div className="mt-8 w-full">
        <AdBanner />
      </div>
    </div>
  );
}