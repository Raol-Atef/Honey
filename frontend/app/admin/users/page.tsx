'use client';

import { useEffect, useState } from 'react';
import { ToggleLeft, ToggleRight, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usersApi } from '@/lib/api/users';
import type { User } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [togglingUser, setTogglingUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    setTogglingUser(user._id);
    try {
      const response = await usersApi.updateStatus(user._id, !user.isActive);
      if (response.success && response.data?.user) {
        setUsers(users.map(u => 
          u._id === user._id 
            ? { ...u, isActive: response.data!.user.isActive } 
            : u
        ));
        toast.success(
          response.data.user.isActive 
            ? 'User activated successfully' 
            : 'User deactivated successfully'
        );
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to update user status');
    } finally {
      setTogglingUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-muted-foreground">{users.length} users total</p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'outline' : 'destructive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(user)}
                      disabled={togglingUser === user._id || user.role === 'admin'}
                      className={user.isActive ? 'text-green-600' : 'text-muted-foreground'}
                    >
                      {togglingUser === user._id ? (
                        <Spinner size="sm" />
                      ) : user.isActive ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedUser.role === 'admin' ? 'Admin' : 'Customer'}
                    </Badge>
                    <Badge variant={selectedUser.isActive ? 'outline' : 'destructive'}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                {selectedUser.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
                {selectedUser.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{selectedUser.address.street}</p>
                      <p>{selectedUser.address.city}, {selectedUser.address.postalCode}</p>
                      <p>{selectedUser.address.country}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedUser.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
