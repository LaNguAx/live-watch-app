import { useAppSelector } from '../../../../store/hooks';
import YouTubePlayer from './YoutubePlayer';

export default function VideoPlayer() {
  const selectedVideo = useAppSelector((store) => store.room.video);
  const { id, title } = selectedVideo;

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl p-6">
        <svg
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25M8.25 9V5.25M3.375 9h17.25m-4.125 4.5v5.25m-9.75-5.25v5.25M12 15.75v5.25"
          />
        </svg>
        <p className="text-lg font-medium">No video selected</p>
        <p className="text-sm text-gray-400 mt-1">
          Search and choose a video to start watching
        </p>
      </div>
    );
  }

  function handleReady() {}
  function handlePlay() {}
  function handlePause() {}
  function handleEnd() {}

  return (
    <div className="w-full">
      <div className="aspect-video">
        <YouTubePlayer
          videoId={id}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnd={handleEnd}
        />
      </div>
    </div>
  );
}
