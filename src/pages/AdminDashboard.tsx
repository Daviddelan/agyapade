import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { DashboardLayout } from '../components/dashboard/Layout';
import { UserManagement } from '../components/admin/UserManagement';
import { SystemSettings } from '../components/admin/SystemSettings';
import { DocumentReview } from '../components/government/DocumentReview';
import { useRole } from '../hooks/useRole';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Loader2 } from 'lucide-react';
import type { Document } from '../types/documents';

export default function AdminDashboard() {
  const { role, loading: roleLoading } = useRole();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docsQuery = query(
          collection(db, 'documents'),
          orderBy('uploadDate', 'desc')
        );
        
        const snapshot = await getDocs(docsQuery);
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate?.toDate() || new Date(),
          reviewDate: doc.data().reviewDate?.toDate() || null
        })) as Document[];
        
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-golden-500" />
      </div>
    );
  }

  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const pendingDocs = documents.filter(doc => doc.status === 'pending');
  const underReviewDocs = documents.filter(doc => doc.status === 'under_review');
  const verifiedDocs = documents.filter(doc => doc.status === 'verified');
  const rejectedDocs = documents.filter(doc => doc.status === 'rejected');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="documents">
              Document Review ({pendingDocs.length + underReviewDocs.length})
            </TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="documents">
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({pendingDocs.length})
                </TabsTrigger>
                <TabsTrigger value="under_review">
                  Under Review ({underReviewDocs.length})
                </TabsTrigger>
                <TabsTrigger value="verified">
                  Verified ({verifiedDocs.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedDocs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <DocumentReview documents={pendingDocs} type="pending" />
              </TabsContent>

              <TabsContent value="under_review">
                <DocumentReview documents={underReviewDocs} type="under_review" />
              </TabsContent>

              <TabsContent value="verified">
                <DocumentReview documents={verifiedDocs} type="verified" />
              </TabsContent>

              <TabsContent value="rejected">
                <DocumentReview documents={rejectedDocs} type="rejected" />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}