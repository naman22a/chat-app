export interface Message {
    id: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    senderId: number;
    roomId: number;
}
