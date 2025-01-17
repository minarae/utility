'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ChevronDown, ChevronRight } from "lucide-react";

export default function JsonFormItem({
  data,
  path = [],
  onUpdate,
  onDelete,
  isArrayItem = false,
  depth = 0
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddField = () => {
    if (!isArrayItem && !newKey.trim()) return;

    const value = newValue.trim();
    const updatedData = JSON.parse(JSON.stringify(data));
    let current = updatedData;

    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }

    if (Array.isArray(current)) {
      current.push(value || {});
    } else {
      try {
        current[newKey] = value ? JSON.parse(value) : {};
      } catch {
        current[newKey] = value || {};
      }
    }

    onUpdate(updatedData);
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteField = (key) => {
    const updatedData = JSON.parse(JSON.stringify(data));
    let current = updatedData;

    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }

    if (Array.isArray(current)) {
      current.splice(key, 1);
    } else {
      delete current[key];
    }
    onUpdate(updatedData);
  };

  const handleValueChange = (key, value) => {
    const updatedData = JSON.parse(JSON.stringify(data));
    let current = updatedData;

    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }

    try {
      if (Array.isArray(current)) {
        current[key] = JSON.parse(value);
      } else {
        current[key] = JSON.parse(value);
      }
    } catch {
      if (Array.isArray(current)) {
        current[key] = value;
      } else {
        current[key] = value;
      }
    }

    onUpdate(updatedData);
  };

  const renderField = (key, value, currentPath) => {
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);
    const indentClass = `ml-${depth * 6}`;  // 깊이에 따른 들여쓰기

    return (
      <div key={key} className={`${indentClass} border-l-2 border-gray-200 dark:border-gray-700 pl-4 my-2`}>
        <div className="flex items-center gap-2 mb-2">
          {isObject && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-6 h-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          )}
          {!isArrayItem && (
            <Input
              value={key}
              onChange={(e) => {
                const updatedData = JSON.parse(JSON.stringify(data));
                let current = updatedData;
                for (let i = 0; i < path.length; i++) {
                  current = current[path[i]];
                }
                const oldValue = current[key];
                delete current[key];
                current[e.target.value] = oldValue;
                onUpdate(updatedData);
              }}
              className="w-[200px]"
            />
          )}
          {!isObject && (
            <Input
              value={typeof value === 'string' ? value : JSON.stringify(value)}
              onChange={(e) => handleValueChange(key, e.target.value)}
              className="flex-1"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteField(key)}
            className="p-1"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
        {isObject && isExpanded && (
          <JsonFormItem
            data={data}
            path={[...currentPath, key]}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isArrayItem={isArray}
            depth={depth + 1}
          />
        )}
      </div>
    );
  };

  let currentObject = data;
  for (const key of path) {
    currentObject = currentObject[key];
  }

  const isCurrentArray = Array.isArray(currentObject);

  return (
    <div className="space-y-2">
      {isCurrentArray
        ? currentObject.map((value, index) => renderField(index, value, path))
        : Object.entries(currentObject).map(([key, value]) => renderField(key, value, path))
      }

      <div className={`flex items-center gap-2 ml-${depth * 6} pl-4`}>
        {!isArrayItem && (
          <Input
            placeholder="새 키"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="w-[200px]"
          />
        )}
        <Input
          placeholder={isArrayItem ? "새 항목" : "새 값 (비워두면 객체 생성)"}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddField}
          className="p-1"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}