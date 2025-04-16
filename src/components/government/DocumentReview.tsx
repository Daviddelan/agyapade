import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: Date;
  userId: string;
  fileUrl: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

interface DocumentReviewProps {
  documents: Document[];
  type: 'pending' | 'verified' | 'rejected';
}

export function DocumentReview({ documents, type }: DocumentReviewProps) {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocumentClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsReviewOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedDoc) return;
    
    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'documents', selectedDoc.id);
      await updateDoc(docRef, {
        status: 'verified',
        reviewedBy: 'government', // In real app, use actual user ID
        reviewDate: serverTimestamp()
      });

      toast({
        title: 'Document Approved',
        description: 'The document has been successfully verified.',
      });

      setIsReviewOpen(false);
      // Refresh the document list (you'll need to implement this)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDoc) return;
    
    setIsSubmitting(true);
    try {
      const docRef = doc(db, 'documents', selectedDoc.id);
      await updateDoc(docRef, {
        status: 'rejected',
        rejectionReason,
        reviewedBy: 'government', // In real app, use actual user ID
        reviewDate: serverTimestamp()
      });

      toast({
        title: 'Document Rejected',
        description: 'The document has been rejected and the owner will be notified.',
      });

      setIsRejectionOpen(false);
      setIsReviewOpen(false);
      setRejectionReason('');
      // Refresh the document list (you'll need to implement this)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleDocumentClick(doc)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </div>
              </div>
              {doc.status === 'pending' && (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
              {doc.status === 'verified' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {doc.status === 'rejected' && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              {format(doc.uploadDate, 'MMM dd, yyyy')}
            </div>

            {doc.rejectionReason && (
              <div className="mt-2 text-sm text-red-600">
                Reason: {doc.rejectionReason}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Document Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Review</DialogTitle>
            <DialogDescription>
              Review the document details and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <iframe
                  src={selectedDoc.fileUrl}
                  className="w-full h-full rounded-lg"
                  title="Document Preview"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Document Name</Label>
                  <p className="text-gray-900">{selectedDoc.name}</p>
                </div>
                <div>
                  <Label>Document Type</Label>
                  <p className="text-gray-900">{selectedDoc.type}</p>
                </div>
                <div>
                  <Label>Upload Date</Label>
                  <p className="text-gray-900">
                    {format(selectedDoc.uploadDate, 'PPP')}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-gray-900 capitalize">{selectedDoc.status}</p>
                </div>
              </div>

              {selectedDoc.rejectionReason && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Rejection Reason: {selectedDoc.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {type === 'pending' && (
              <>
                <button
                  onClick={() => setIsRejectionOpen(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Approve
                </button>
              </>
            )}
            <a
              href={selectedDoc?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Full Document
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectionOpen} onOpenChange={setIsRejectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Input
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection"
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setIsRejectionOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300"
            >
              Confirm Rejection
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}