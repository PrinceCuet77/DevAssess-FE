type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <div className='flex flex-wrap items-end justify-between gap-4 border-b border-border/60 pb-5'>
    <div className='flex flex-col gap-1'>
      <h1 className='font-heading text-2xl font-semibold tracking-tight sm:text-3xl'>{title}</h1>
      {description && <p className='text-sm text-muted-foreground'>{description}</p>}
    </div>
    {actions && <div className='flex shrink-0 items-center gap-2'>{actions}</div>}
  </div>
);

export default PageHeader;
