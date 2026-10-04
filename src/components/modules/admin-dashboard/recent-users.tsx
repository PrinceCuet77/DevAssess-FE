import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AdminRecentUser,
  UserStatus,
} from "@/types/admin-dashboard.types";

const STATUS_VARIANT: Record<
  UserStatus,
  "success" | "warning" | "secondary" | "destructive"
> = {
  VERIFIED: "success",
  NOT_VERIFIED: "warning",
  SUSPENDED: "destructive",
  DELETED: "secondary",
};

const label = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replace("_", " ");

const RecentUsers = ({ users }: { users: AdminRecentUser[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent users</CardTitle>
      <CardDescription>Newest sign-ups on the platform.</CardDescription>
      <CardAction>
        <Link
          href="/admin/users"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          View all
        </Link>
      </CardAction>
    </CardHeader>
    <CardContent>
      {users.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No users yet.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border/60">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/users/detail?id=${user.id}`}
                  className="block truncate text-sm font-medium hover:underline"
                >
                  {user.name ?? user.email}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  {label(user.role)} ·{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[user.status]}>
                {label(user.status)}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentUsers;
