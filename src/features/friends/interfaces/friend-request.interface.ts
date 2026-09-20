export interface FriendRequest {
  Id: string;
  SenderId: string;
  ReceiverId: string;
  Status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  CreatedAt?: string;
  UpdatedAt?: string;
  SenderUsername?: string;
  SenderFirstName?: string;
  SenderLastName?: string;
  SenderAvatar?: string | null;
  ReceiverUsername?: string;
  ReceiverFirstName?: string;
  ReceiverLastName?: string;
  ReceiverAvatar?: string | null;
}
