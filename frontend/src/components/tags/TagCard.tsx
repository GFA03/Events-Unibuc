import { Tag } from '@/types/tag';

interface TagProps {
  tag: Tag;
  size?: 'small' | 'medium' | 'large';
}

export default function TagCard({ tag, size = 'small' }: TagProps) {
  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-3 py-2',
    large: 'text-lg px-4 py-3'
  };

  return (
    <div className={`bg-gray-200 rounded-full ${sizeClasses[size]} inline-block`}>
      <span className="text-gray-800">{tag.name}</span>
    </div>
  );
}
