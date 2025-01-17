'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function QRGeneratorPage() {
  const [url, setUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(256);

  const handleGenerate = () => {
    if (!url) {
      setError('URL을 입력해주세요.');
      setQrUrl('');
      return;
    }

    try {
      // URL 유효성 검사
      new URL(url);
      setError('');
      setQrUrl(url);
    } catch (e) {
      setError('유효한 URL을 입력해주세요.');
      setQrUrl('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value) || 0;
    if (newSize < 128) {
      setError('QR 코드 크기는 128px 이상이어야 합니다.');
      setSize(128);
    } else {
      setError('');
      setSize(newSize);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] p-4 lg:ml-0">
      <h1 className="text-2xl font-bold mb-4 pl-8 lg:pl-0">QR 코드 생성기</h1>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 max-w-96">
            <Input
              className="max-w-96"
              type="text"
              placeholder="URL을 입력하세요"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex gap-1 items-center min-w-[100px] max-w-96">
            <Input
              type="number"
              min="128"
              value={size}
              onChange={handleSizeChange}
              className="w-24"
              placeholder="크기(px)"
            />
            <span className="text-sm text-muted-foreground">px</span>
          </div>
          <Button onClick={handleGenerate}>
            생성
          </Button>
        </div>

        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}

        {qrUrl && (
          <Card className="p-8 inline-block">
            <div className="space-y-4">
              <QRCodeSVG
                value={qrUrl}
                size={size}
                level="H"
                includeMargin
                className="bg-white p-2 rounded"
              />
              <p className="text-sm text-muted-foreground break-all max-w-[500px]">
                {qrUrl}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}