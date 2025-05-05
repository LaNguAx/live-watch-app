import { useAppSelector } from '../../../../store/hooks';

export default function Chat() {
  const users = useAppSelector((store) => store.room.users);
  const chat = useAppSelector((store) => store.room.chat);

  const userNames = Object.values(users).map(({ name }, _i) => (
    <span key={_i}>
      <span>{name}</span>
      <br />
    </span>
  ));

  return (
    <article className="flex flex-col justify-between rounded-[10px] border border-gray-200 bg-white px-3 py-2 h-60 sm:h-96 overflow-y-auto">
      <p className="text-[0.65rem] font-light">
        <span className="text-xs font-medium mr-2">User 1:</span>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur,
        expedita. {chat}
      </p>
      <p className="text-xs">{userNames}</p>
    </article>
  );
}
