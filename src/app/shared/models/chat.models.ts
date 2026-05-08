export interface ChatThread {
  id: string;
  productId: string;
  productTitle: string;
  buyerName: string;
  sellerName: string;
  lastMessage: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: string;
}
