import { Edit3, Trash2 } from 'lucide-react';
import { TagWithCount } from '@/features/tag/types/tagWithCount';

interface Props {
  tag: TagWithCount;
  onEdit: (tag: TagWithCount) => void;
  onDelete: (tagId: string) => void;
}

export default function ManageTagCard({tag, onEdit, onDelete}: Props) {
  return(
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#3B82F6'}}
          />
          <h3 className="text-lg font-semibold text-gray-900">
            {tag.name}
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(tag)}
            className="p-1 text-gray-400 hover:text-purple-600 rounded transition-colors duration-200"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(tag.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Used in events
                </span>
        <span className="text-sm font-bold text-purple-600">
                  {tag.count}
                </span>
      </div>
    </div>
  );
}