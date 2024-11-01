import React from 'react';
import { Category } from '../types';
import { categories } from '../data/categories';
import * as Icons from 'lucide-react';

interface CategorySelectProps {
  onSelect: (category: Category) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons];
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <IconComponent className="w-12 h-12 mb-3 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.words.length} words</p>
          </button>
        );
      })}
    </div>
  );
};