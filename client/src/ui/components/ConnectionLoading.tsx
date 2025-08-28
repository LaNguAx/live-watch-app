import Spinner from './Spinner';

interface ConnectionLoadingProps {
  className?: string;
}

export default function ConnectionLoading({
  className = '',
}: ConnectionLoadingProps) {
  return (
    <div
      className={`fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin mx-auto"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Connecting to Server
          </h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Please wait while we connect to the server.
            <br />
            <span className="text-indigo-700 font-medium">
              The server may be asleep because it's on a free plan and could take
              up to a minute to wake up.
            </span>
          </p>

          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
