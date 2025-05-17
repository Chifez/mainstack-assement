import { MessageCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReactNode, useState } from 'react';

export function ChatPopover({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Handle sending message
    setMessage('');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={20} alignOffset={0} className="w-64 p-0">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Chat with Customer Support</h3>
        </div>
        <div className="h-[300px] flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Start a conversation with our support team
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-100"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!message.trim()}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
