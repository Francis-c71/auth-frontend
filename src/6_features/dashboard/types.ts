import type { useAuth } from '@/6_features/auth/contexts/AuthContext';

export type DashboardUser = NonNullable<ReturnType<typeof useAuth>['user']>;