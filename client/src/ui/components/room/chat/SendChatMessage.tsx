import { FormEvent, useState } from 'react';
import Button from '../../Button';
import Input from '../../Input';
import { EmitFunction } from '../../../../hooks/useSocket';

interface SendChatMessageProps {
  toChatRoom: string;
  emitter: EmitFunction;
}

export default function SendChatMessage({
  toChatRoom,
  emitter: emit,
}: SendChatMessageProps) {
  const [text, setText] = useState('');

  function handleSendChatMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    console.log(text);

    emit('send-message', { roomId: toChatRoom, message: text });

    setText('');
  }

  return (
    <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
      />
      <Button
        type="submit"
        className="cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition text-xs"
      >
        Send
      </Button>
    </form>
  );
}
