import { useAppSelector } from '../../../../store/hooks';

export default function Chat() {
  const users = useAppSelector((store) => store.room.users);
  const chat = useAppSelector((store) => store.room.chat);

  const userNames = Object.values(users).map(({ name }, _i) => (
    <span key={_i}>
      🧑&nbsp;<span>{name}</span>
      <br />
    </span>
  ));

  return (
    <article className="relative w-full flex flex-col justify-between rounded-[10px] border border-gray-200 bg-white h-80 sm:h-96 overflow-hidden">
      <div className="overflow-y-auto px-3 py-2 flex-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <p className="text-lg font-light">
            <span className="font-medium mr-2">User 1:</span>
            <span>text here</span>
          </p>
        ))}
      </div>
      <div className="w-full px-2 py-1 border-t bg-white border-gray-200 ">
        <p className="text-md">
          <strong>Connected Users:</strong>
          <br />
          {userNames}
        </p>
      </div>
    </article>
  );
}
