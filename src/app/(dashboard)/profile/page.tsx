import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update profile - DevAssess',
};

const Page = () => {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8'>
      <h1 className='font-heading text-2xl font-semibold tracking-tight'>Update profile</h1>
    </div>
  );
};

export default Page;
