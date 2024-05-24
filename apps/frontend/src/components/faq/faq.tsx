import { component$ } from '@builder.io/qwik';

export const Faq = component$(() => {
  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will remain active until the end of the billing cycle.',
    },
    {
      question: 'How do I track the clicks on my shortened URLs?',
      answer:
        'Our URL shortener service provides detailed analytics on the number of clicks, geographic location of the clicks, and the referrer. You can access this information from your dashboard.',
    },
    {
      question: 'Is there a limit to how many URLs I can shorten?',
      answer:
        'The Free plan allows you to shorten up to 10 URLs per month. Our Pro and Business plans offer higher limits of 500 and 2000 URLs per month, respectively.',
    },
    {
      question: 'Can I customize the short URL?',
      answer:
        'Yes, you can customize your short URL with a custom alias if you are on the Pro or Business plan. This feature is not available on the Free plan.',
    },
    {
      question: 'How secure are my shortened URLs?',
      answer:
        'We prioritize the security of your data. All shortened URLs are protected with SSL encryption. Additionally, we offer features like password protection and link expiration on our Pro and Business plans.',
    },
    {
      question: 'Can I generate QR code for all my short links?',
      answer:
        'Yes, you can generate QR codes for all your short links. This feature is available on all our plans. You can download the QR code and use it in your marketing materials.',
    },
  ];

  return (
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 class="text-2xl font-bold md:text-3xl md:leading-tight text-gray-800 dark:text-neutral-200">Frequently Asked Questions</h2>
      </div>

      <div class="max-w-5xl mx-auto">
        <div class="grid sm:grid-cols-2 gap-6 md:gap-12">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">{faq.question}</h3>
              <p class="mt-2 text-gray-600 dark:text-neutral-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
