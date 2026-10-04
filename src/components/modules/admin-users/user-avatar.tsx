import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type IProps = {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  className?: string;
};

const UserAvatar = ({ name, email, avatarUrl, className }: IProps) => (
  <Avatar className={cn('size-10', className)}>
    {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? email} />}
    <AvatarFallback>{(name ?? email).charAt(0).toUpperCase()}</AvatarFallback>
  </Avatar>
);

export default UserAvatar;
