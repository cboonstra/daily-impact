export interface UserLink {
    label: string;
    url: string;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    bio: string;
    avatarUrl: string | null;
    links: UserLink[];
    friendCount: number;
}

export interface PublicUserResponse {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string | null;
}

export interface AuthResponse {
    token: string;
    user: UserResponse;
}

export interface ProgressResponse {
    userId: string;
    total: number;
    streak: number;
    lastCompletedDate: string | null;
    completedSdgIds: number[];
    history: Record<string, boolean>;
}

export interface FriendResponse {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string | null;
    impactTotal: number;
    streak: number;
}

export interface FriendRequestResponse {
    id: string;
    fromUser: PublicUserResponse;
    toUser: PublicUserResponse;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    createdAt: string;
}
