import { Button } from '@/components/ui/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showPageNumbers?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  isLastPage,
  onPageChange,
  isLoading = false,
  showPageNumbers = true
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Page Info */}
      <div className="text-sm text-gray-700">
        Showing page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          variant="secondary"
          size="sm"
          className="px-3">
          <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
        </Button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-3 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    variant={currentPage === page ? 'primary' : 'secondary'}
                    size="sm"
                    className="px-3 min-w-[2.5rem]">
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Next Button */}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage || isLoading}
          variant="secondary"
          size="sm"
          className="px-3">
          <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
        </Button>
      </div>

      {/* Simple Previous/Next for mobile */}
      <div className="flex sm:hidden items-center gap-2 mt-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          variant="secondary"
          size="sm">
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage || isLoading}
          variant="secondary"
          size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
