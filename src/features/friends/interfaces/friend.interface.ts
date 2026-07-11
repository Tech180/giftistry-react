export interface Friend {
  Id: string;
  UserId: string;
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Avatar: string | null;
  FriendsSince?: string;
  Birthday?: string | null;
  WishlistCount?: number;
  MutualsCount?: number;
  RecentActivity?: string;
  DaysUntilBirthday?: number;
  LastOnline?: string | null;
}


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

export interface FriendRequestsResult {
  Incoming: FriendRequest[];
  Outgoing: FriendRequest[];
}

export interface UserSearchResult {
  Id: string;
  Username: string;
  FirstName?: string;
  LastName?: string;
  Avatar?: string | null;
}
