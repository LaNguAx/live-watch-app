import { useAppSelector } from '../../../../store/hooks';
import { Chat as ChatType } from '../../../../store/slices/roomSlice';

export default function Chat() {
  const users = useAppSelector((store) => store.room.users);
  const chat: ChatType = useAppSelector((store) => store.room.chat);

  const userNames = Object.values(users).map(({ name }, _i) => (
    <span key={`${name}${_i}`}>
      🧑&nbsp;<span>{name}</span>
      <br />
    </span>
  ));

  return (
    <article className="relative w-full flex flex-col justify-between rounded-[10px] border border-gray-200 bg-white h-60 lg:h-80 lg:flex-1 lg:min-h-0 overflow-hidden">
      <div className="overflow-y-auto px-3 py-2 flex-1">
        {chat.map((message) => (
          <p className="text-lg font-light tracking-wider">
            <span className="font-medium mr-2">{message.user}:</span>
            <span>{message.message}</span>
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
