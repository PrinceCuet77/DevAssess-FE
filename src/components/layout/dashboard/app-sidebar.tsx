'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { ROLE_NAV_ITEMS, USER_NAV_ITEMS, type INavItem } from '@/constants/routes';
import { useGetMyProfile } from '@/hooks';

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: user } = useGetMyProfile();
  const roleItems = user ? ROLE_NAV_ITEMS[user.role] : [];
  const dashboardHref = roleItems[0]?.href;

  // Most specific match wins, so /developer/assessments/new doesn't also highlight /developer/assessments.
  // With "Browse assessments" gone from the developer nav, their owned-assessment pages live under /developer/assessments.
  const activeHref = pathname.startsWith('/developer/assessments/')
    ? '/developer/my-assessments'
    : [...roleItems]
    .filter(({ href }) =>
      href === dashboardHref ? pathname === href : pathname === href || pathname.startsWith(`${href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const renderItems = (items: INavItem[], isActive: (href: string) => boolean) =>
    items.map(({ title, href, icon: Icon }) => (
      <SidebarMenuItem key={href}>
        <SidebarMenuButton isActive={isActive(href)} tooltip={title} render={<Link href={href} />}>
          <Icon />
          <span>{title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <Link href='/' className='px-2 py-1 font-heading text-lg font-semibold tracking-tight'>
          DevAssess
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {roleItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(roleItems, (href) => href === activeHref)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(USER_NAV_ITEMS, (href) => pathname === href)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
