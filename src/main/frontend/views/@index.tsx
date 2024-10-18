import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { AvatarGroup, AvatarGroupItem, Button, MessageInput, MessageList } from '@vaadin/react-components';
import { ChatService } from 'Frontend/generated/endpoints';
import Chance from 'chance';
import { effect, signal } from '@vaadin/hilla-react-signals';

export const config: ViewConfig = { menu: { order: 0, icon: 'line-awesome/svg/file.svg' }, title: 'Chat' };

const userName = new Chance().name();
let userColorIndex = 0;
const messages = ChatService.getMessages();
const usernames = signal<AvatarGroupItem[]>([]);

effect(() => {
  usernames.value = Array.from(
    new Map(
      messages.value
        .map(message => message.value)
        .filter(Boolean)
        .map(m => [m.userName, { name: m.userName, colorIndex: m.userColorIndex }])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));
});

export default function ChatView() {
  return (
    <div className="flex flex-col h-full p-l box-border">
      <AvatarGroup items={usernames.value} />
      <MessageList items={messages.value.map(message => ({ ...message.value, className: message.value.userName === userName ? 'current-user' : undefined }))} />
      <MessageInput onSubmit={({ detail: { value } }) => {
        if (userColorIndex === 0) {
          userColorIndex = Math.max(...usernames.value.map(user => user.colorIndex ?? 0), 0) + 1;
        }
        messages.insertLast({ userName, text: value, userColorIndex });
      }} />
      <div>
        Connected as: {userName}
      </div>
      <div>
        {(messages.value.length > 0 && messages.value[messages.value.length - 1].value.userName === userName) ?
          <Button onClick={() => messages.remove(messages.value[messages.value.length - 1])}>Delete last message</Button> : null
        }
      </div>
    </div>
  );
}
