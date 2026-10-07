export type FaqItem = { question: string; answer: string };

export type FaqGroup = { title: string; items: FaqItem[] };

// Shared by the home page FAQ and the help center.
export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Getting started',
    items: [
      {
        question: 'What is DevAssess?',
        answer:
          'DevAssess is a marketplace for technical assessments. Evaluators publish timed, multiple-choice tests on topics like React, Node.js or SQL, and developers buy them to measure and prove their skills.',
      },
      {
        question: 'How do I create an account?',
        answer:
          'Click “Get started”, choose whether you are a developer or an evaluator, and register with your email or Google. Email sign-ups confirm their address with a one-time code before the first login.',
      },
      {
        question: 'Can I browse before signing up?',
        answer:
          'Yes. The full catalog, assessment details and developer reviews are public. You only need an account to purchase or publish an assessment.',
      },
    ],
  },
  {
    title: 'For developers',
    items: [
      {
        question: 'How do payments work?',
        answer:
          'Each assessment has a one-time price in BDT. Checkout is handled by SSLCommerz, so you can pay with cards or mobile banking. Once the payment succeeds the assessment appears under “My assessments” in your dashboard.',
      },
      {
        question: 'Is there a time limit?',
        answer:
          'Every assessment has its own time limit, shown on the card and the detail page. The timer starts when you begin an attempt and cannot be paused, so start when you have an uninterrupted block of time.',
      },
      {
        question: 'Can I retake an assessment?',
        answer:
          'Yes. Retakes are allowed on assessments you own and every attempt is kept in your history, so you can track how your score improves.',
      },
      {
        question: 'How do I pass?',
        answer:
          'Each assessment sets a pass mark as a percentage. Score at or above it and the attempt is marked as passed on your dashboard.',
      },
    ],
  },
  {
    title: 'For evaluators',
    items: [
      {
        question: 'What can I publish?',
        answer:
          'Multiple-choice assessments with one correct option per question. You choose the title, description, topics, thumbnail, duration, pass mark and price, and can keep an assessment as a draft until it is ready.',
      },
      {
        question: 'How do I track sales?',
        answer:
          'Your evaluator dashboard shows revenue, orders, attempts, pass rate and recent reviews. The Sales page lists every order that includes one of your assessments.',
      },
      {
        question: 'Can I edit an assessment after publishing?',
        answer:
          'Yes. You can update content and pricing at any time, archive an assessment to hide it from the catalog, or move it back to draft.',
      },
    ],
  },
];

// The home page shows a short selection.
export const HOME_FAQ: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[1].items[1],
  FAQ_GROUPS[1].items[2],
  FAQ_GROUPS[2].items[0],
];
