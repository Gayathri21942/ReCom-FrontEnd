import { Injectable, signal } from '@angular/core';
import { ChatMessage, ChatThread } from '../../../shared/models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  readonly threads = signal<ChatThread[]>([
    { id: 'thread-1', productId: '1', productTitle: 'iPhone 14 128GB', buyerName: 'Demo Buyer', sellerName: 'Rahul', lastMessage: 'Can you share the final price?', updatedAt: new Date().toISOString() }
  ]);

  readonly messages = signal<ChatMessage[]>([
    { id: 'message-1', threadId: 'thread-1', fromUserId: 'buyer-1', toUserId: 'seller-1', text: 'Hi, is this still available?', createdAt: new Date().toISOString() },
    { id: 'message-2', threadId: 'thread-1', fromUserId: 'seller-1', toUserId: 'buyer-1', text: 'Yes, available.', createdAt: new Date().toISOString() }
  ]);

  sendMessage(threadId: string, fromUserId: string, toUserId: string, text: string) {
    this.messages.update((messages) => [...messages, { id: crypto.randomUUID(), threadId, fromUserId, toUserId, text, createdAt: new Date().toISOString() }]);
    this.threads.update((threads) => threads.map((thread) => thread.id === threadId ? { ...thread, lastMessage: text, updatedAt: new Date().toISOString() } : thread));
  }
}
