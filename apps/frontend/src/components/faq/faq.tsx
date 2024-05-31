import { $, component$, useSignal } from '@builder.io/qwik';
import { LuChevronDown, LuChevronUp } from '@qwikest/icons/lucide';

export const Faq = component$(() => {
  const activeAccordion = useSignal<number | null>(null);

  const toggleAccordion = $((index: number) => {
    activeAccordion.value = activeAccordion.value === index ? null : index;
  });

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
        'The Free plan allows you to shorten up to 5 URLs per month. Our Pro and Business plans offer higher limits of 500 and 2000 URLs per month, respectively.',
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
    <div class="py-10 px-6 lg:px-8 lg:py-14">
      <div class="grid md:grid-cols-8 gap-5">
        <div class="md:col-start-3 md:col-span-2 flex justify-center md:justify-start sm:mt-14 mt-0">
          <div class="max-w-xs md:w-full">
            <h2 class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
              Frequently
              <br />
              asked questions
            </h2>
            <p class="mt-1 hidden md:block text-gray-600 dark:text-neutral-400">Answers to the most frequently asked questions.</p>
          </div>
        </div>

        <div class="md:col-span-2">
          <div class="hs-accordion-group divide-y divide-gray-200 dark:divide-neutral-700">
            {faqs.map((faq, index) => (
              <div class={`hs-accordion pt-6 pb-3 ${activeAccordion.value === index ? 'active' : ''}`} key={index}>
                <button
                  class="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400"
                  aria-controls={`hs-accordion-content-${index}`}
                  onClick$={() => toggleAccordion(index)}
                >
                  {faq.question}
                  {activeAccordion.value === index ? (
                    <LuChevronUp class="flex-shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" />
                  ) : (
                    <LuChevronDown class="flex-shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" />
                  )}
                </button>
                <div
                  id={`hs-accordion-content-${index}`}
                  class={`hs-accordion-content ${
                    activeAccordion.value === index ? 'block' : 'hidden'
                  } overflow-hidden text-left transition-[height] duration-300`}
                  aria-labelledby={`hs-accordion-heading-${index}`}
                >
                  <p class="text-gray-600 dark:text-neutral-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
