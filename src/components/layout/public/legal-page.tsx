import { Container, PageHero } from '@/components/layout/public/marketing-section';

export type LegalSection = { heading: string; body: React.ReactNode };

type IProps = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Long-form legal text: sticky table of contents on desktop, readable line length everywhere.
const LegalPage = ({ title, description, updated, sections }: IProps) => (
  <>
    <PageHero eyebrow='Legal' title={title} description={description} />
    <Container className='grid gap-10 py-12 lg:grid-cols-[15rem_1fr] lg:py-16'>
      <nav aria-label='On this page' className='hidden lg:block'>
        <div className='sticky top-24 flex flex-col gap-2'>
          <p className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'>On this page</p>
          <ol className='flex flex-col gap-1.5 text-sm'>
            {sections.map((section, i) => (
              <li key={section.heading}>
                <a href={`#${slug(section.heading)}`} className='text-muted-foreground hover:text-foreground'>
                  {i + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <article className='flex max-w-3xl flex-col gap-10'>
        <p className='text-sm text-muted-foreground'>Last updated: {updated}</p>
        {sections.map((section, i) => (
          <section key={section.heading} id={slug(section.heading)} className='flex scroll-mt-24 flex-col gap-3'>
            <h2 className='font-heading text-xl font-semibold tracking-tight'>
              {i + 1}. {section.heading}
            </h2>
            <div className='flex flex-col gap-3 text-[15px] leading-7 text-foreground/85 [&_a]:font-medium [&_a]:text-primary [&_a:hover]:underline [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5'>
              {section.body}
            </div>
          </section>
        ))}
      </article>
    </Container>
  </>
);

export default LegalPage;
