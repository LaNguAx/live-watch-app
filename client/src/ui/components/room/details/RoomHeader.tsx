interface RoomHeaderProps {
  roomId: string;
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  return (
    <>
      <h2 className="text-1xl font-bold text-gray-900">
        🎥 You’re in Room #{roomId}
      </h2>
      <p className="mt-2 text-lg text-gray-600">
        Chat with friends, enjoy the show, and leave anytime you like.
      </p>
    </>
  );
}
