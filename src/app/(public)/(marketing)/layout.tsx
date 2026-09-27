import Header from '@/components/layout/public/header';
import Footer from '@/components/layout/public/footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
