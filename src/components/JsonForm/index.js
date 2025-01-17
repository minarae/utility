'use client';
import { useState, useEffect } from 'react';
import JsonFormItem from './JsonFormItem';

export default function JsonForm({ initialJson, onChange }) {
  const [data, setData] = useState({});

  useEffect(() => {
    try {
      const parsed = typeof initialJson === 'string'
        ? JSON.parse(initialJson)
        : initialJson;
      setData(parsed);
    } catch (error) {
      console.error('Invalid JSON:', error);
      setData({});
    }
  }, [initialJson]);

  const handleUpdate = (newData) => {
    setData(newData);
    if (onChange) {
      onChange(JSON.stringify(newData, null, 2));
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background">
      <JsonFormItem
        data={data}
        onUpdate={handleUpdate}
        onDelete={(path) => {
          const newData = { ...data };
          let current = newData;
          const lastKey = path[path.length - 1];

          for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
          }

          delete current[lastKey];
          handleUpdate(newData);
        }}
      />
    </div>
  );
}