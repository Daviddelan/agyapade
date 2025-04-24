import React from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { DashboardLayout } from '../components/dashboard/Layout';
import { UserManagement } from '../components/admin/UserManagement';
import { DocumentList } from '../components/dashboard/DocumentList';
import { useRole } from '../hooks/useRole';

export default function AdminDashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="documents">All Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentList documents={[]} showAll />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
