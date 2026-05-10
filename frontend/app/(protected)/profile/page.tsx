'use client';

import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-2 text-muted-foreground">View your account information</p>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                  </Badge>
                  <Badge variant={user.isActive ? 'outline' : 'destructive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{user.phone || 'Not provided'}</p>
              </div>
            </div>
            {user.createdAt && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium text-foreground">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Address */}
        {user.address && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-secondary p-4">
                <p className="font-medium text-foreground">{user.address.street}</p>
                <p className="text-muted-foreground">
                  {user.address.city}, {user.address.postalCode}
                </p>
                <p className="text-muted-foreground">{user.address.country}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Password</p>
                <p className="text-sm text-muted-foreground">
                  Your password is securely stored
                </p>
              </div>
              <p className="text-muted-foreground">••••••••</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
