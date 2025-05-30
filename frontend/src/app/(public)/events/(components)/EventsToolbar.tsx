import { Button } from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faList, faGrip } from '@fortawesome/free-solid-svg-icons';

interface EventsToolbarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function EventsToolbar({
  showFilters,
  onToggleFilters,
  hasActiveFilters,
  viewMode = 'grid',
  onViewModeChange
}: EventsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Results Count */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
      </div>

      {/* Toolbar Actions */}
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        {onViewModeChange && (
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}>
              <FontAwesomeIcon icon={faGrip} className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}>
              <FontAwesomeIcon icon={faList} className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Toggle Button */}
        <Button
          onClick={onToggleFilters}
          variant={showFilters ? 'primary' : 'secondary'}
          className="relative">
          <FontAwesomeIcon icon={faFilter} className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </div>
    </div>
  );
}
