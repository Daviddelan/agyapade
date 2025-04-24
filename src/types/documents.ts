import { Timestamp } from 'firebase/firestore';

export type DocumentStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

export interface BlockchainVerification {
  transactionId: string;
  timestamp: number;
  verifiedBy: string;
  docHash: string;
}

export interface DocumentReviewState {
  status: DocumentStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewStartedAt?: Timestamp;
  lastUpdatedAt?: Timestamp;
  blockchainVerification?: BlockchainVerification;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    status: DocumentStatus;
    uploadDate: Date;
    userId: string;
    fileUrl: string;
    reviewState?: DocumentReviewState;
    rejectionReason?: string;
    statusChangeReason?: string;
    reviewedBy?: string;
    reviewDate?: Date | null;
    blockchainVerification?: BlockchainVerification;
}

export interface DocumentStatusLog {
  documentId: string;
  previousStatus: DocumentStatus;
  newStatus: DocumentStatus;
  reason?: string;
  changedBy: string;
  changedAt: Timestamp;
}