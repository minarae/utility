'use client';
import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Smile, X } from "lucide-react";

export default function QRGeneratorPage() {
  const [url, setUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [emojiSize, setEmojiSize] = useState(40);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [padding, setPadding] = useState(0);
  const qrRef = useRef(null);

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

  const downloadQR = (format) => {
    if (!qrRef.current) return;

    const canvas = document.createElement('canvas');
    const svgData = new XMLSerializer().serializeToString(qrRef.current);

    if (format === 'svg') {
      const svgContent = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="${size + (padding * 2) + (borderWidth * 2)}"
          height="${size + (padding * 2) + (borderWidth * 2)}"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="${bgColor}"
            ${borderWidth > 0 ? `stroke="${borderColor}" stroke-width="${borderWidth}"` : ''}
            rx="8"
            ry="8"
          />
          <g transform="translate(${padding + borderWidth}, ${padding + borderWidth})">
            ${svgData}
            ${selectedEmoji ? `
              <foreignObject
                x="${size / 2 - (emojiSize * 1.2) / 2}"
                y="${size / 2 - (emojiSize * 1.2) / 2}"
                width="${emojiSize * 1.2}"
                height="${emojiSize * 1.2}"
              >
                <div xmlns="http://www.w3.org/1999/xhtml"
                  style="
                    width: 100%;
                    height: 100%;
                    background-color: ${bgColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${emojiSize}px;
                    border-radius: 4px;
                  "
                >
                  ${selectedEmoji.emoji}
                </div>
              </foreignObject>
            ` : ''}
          </g>
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const totalSize = size + (padding * 2) + (borderWidth * 2);
      canvas.width = totalSize;
      canvas.height = totalSize;
      const ctx = canvas.getContext('2d');

      // 배경과 테두리 그리기
      ctx.fillStyle = bgColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;

      // 둥근 모서리의 사각형 그리기
      ctx.beginPath();
      ctx.roundRect(
        borderWidth / 2,
        borderWidth / 2,
        totalSize - borderWidth,
        totalSize - borderWidth,
        8
      );
      ctx.fill();
      if (borderWidth > 0) {
        ctx.stroke();
      }

      // QR 코드와 이모지 그리기
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, padding + borderWidth, padding + borderWidth);

        if (selectedEmoji) {
          const emojiBoxSize = emojiSize * 1.2;
          const x = totalSize / 2 - emojiBoxSize / 2;
          const y = totalSize / 2 - emojiBoxSize / 2;

          ctx.fillStyle = bgColor;
          ctx.fillRect(x, y, emojiBoxSize, emojiBoxSize);

          ctx.font = `${emojiSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            selectedEmoji.emoji,
            totalSize / 2,
            totalSize / 2
          );
        }

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'qrcode.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      };

      img.src = url;
    }
  };

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData);
    setShowEmojiPicker(false);
  };

  const handleEmojiSizeChange = (e) => {
    const newSize = parseInt(e.target.value) || 0;
    if (newSize < 20) {
      setEmojiSize(20);
    } else if (newSize > size / 4) {
      setEmojiSize(Math.floor(size / 4));
    } else {
      setEmojiSize(newSize);
    }
  };

  const removeEmoji = () => {
    setSelectedEmoji(null);
    setShowEmojiPicker(false);
  };

  const handleBorderWidthChange = (e) => {
    const newWidth = parseInt(e.target.value) || 0;
    if (newWidth < 0) {
      setBorderWidth(0);
    } else if (newWidth > 20) {
      setBorderWidth(20);
    } else {
      setBorderWidth(newWidth);
    }
  };

  const handlePaddingChange = (e) => {
    const newPadding = parseInt(e.target.value) || 0;
    if (newPadding < 0) {
      setPadding(0);
    } else if (newPadding > 50) {
      setPadding(50);
    } else {
      setPadding(newPadding);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] p-4 lg:ml-0">
      <h1 className="text-2xl font-bold mb-4 pl-8 lg:pl-0">URL QR Code Generator</h1>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 max-w-96">
            <Input
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
              placeholder="Size(px)"
            />
            <span className="text-sm text-muted-foreground">px</span>
          </div>
          <Button onClick={handleGenerate}>
            Generate
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm">QR Code Color:</label>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Background Color:</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="gap-2"
              >
                <Smile className="w-4 h-4" />
                Emoji {selectedEmoji ? selectedEmoji.emoji : 'Select'}
              </Button>
              {showEmojiPicker && (
                <div className="absolute z-50 mt-1">
                  <Card>
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={320}
                      height={400}
                    />
                  </Card>
                </div>
              )}
            </div>
            {selectedEmoji && (
              <>
                <Input
                  type="number"
                  value={emojiSize}
                  onChange={handleEmojiSizeChange}
                  className="w-20"
                  placeholder="Size"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeEmoji}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Border:</label>
            <Input
              type="number"
              min="0"
              max="20"
              value={borderWidth}
              onChange={handleBorderWidthChange}
              className="w-20"
              placeholder="width"
            />
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Padding:</label>
            <Input
              type="number"
              min="0"
              max="50"
              value={padding}
              onChange={handlePaddingChange}
              className="w-20"
              placeholder="Padding"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}

        {qrUrl && (
          <Card className="p-8 inline-block">
            <div className="space-y-4">
              <div className="relative pt-12">
                <div className="absolute top-0 right-0 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadQR('svg')}
                    className="opacity-80 hover:opacity-100"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    SVG
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadQR('png')}
                    className="opacity-80 hover:opacity-100"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PNG
                  </Button>
                </div>
                <div
                  className="mt-2 relative w-fit"
                  style={{
                    padding: `${padding}px`,
                    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
                    backgroundColor: bgColor,
                    borderRadius: '8px'
                  }}
                >
                  <QRCodeSVG
                    ref={qrRef}
                    value={qrUrl}
                    size={size}
                    level="H"
                    includeMargin
                    fgColor={fgColor}
                    bgColor={bgColor}
                    className="rounded"
                  />
                  {selectedEmoji && (
                    <div
                      className="absolute"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${emojiSize}px`,
                        lineHeight: 1,
                        backgroundColor: bgColor,
                        padding: '4px',
                        borderRadius: '4px',
                        width: `${emojiSize * 1.2}px`,
                        height: `${emojiSize * 1.2}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        zIndex: 10
                      }}
                    >
                      {selectedEmoji.emoji}
                    </div>
                  )}
                </div>
              </div>
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