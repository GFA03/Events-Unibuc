import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';

type Props = {
  totalCount: number;
};

export default function EventsHeader({ totalCount }: Props) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Discover Events
            </h1>
            <p className="text-gray-600 text-lg">Find amazing events happening around you</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FontAwesomeIcon icon={faTicket} className="text-indigo-500" />
                <span>{totalCount} events available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
