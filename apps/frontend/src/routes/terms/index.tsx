import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="text-left py-8 md:container md:mx-auto mx-5">
      <h1 class="text-5xl font-bold my-8">Terms and Conditions</h1>
      <p class="leading-relaxed dark:text-gray-300">
        Subject to these Terms of Service (this "Agreement"), Reduced.to ("Reduced.to", "we", "us" and/or "our") provides access to
        Reduced.to's cloud platform as a service (collectively, the "Services"). By using or accessing the Services, you acknowledge that
        you have read, understand, and agree to be bound by this Agreement.
      </p>
      <p class="leading-relaxed dark:text-gray-300">
        If you are entering into this Agreement on behalf of a company, business, or other legal entity, you represent that you have the
        authority to bind such entity to this Agreement, in which case the term "you" shall refer to such entity. If you do not have such
        authority, or if you do not agree with this Agreement, you must not accept this Agreement and may not use the Services.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Acceptance of Terms</h2>
      <p class="leading-relaxed dark:text-gray-300">
        By signing up and using the services provided by Reduced.to (referred to as the "Service"), you are agreeing to be bound by the
        following terms and conditions ("Terms of Service"). The Service is owned and operated by Reduced.to ("Us", "We", or "Our").
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Description of Service</h2>
      <p class="leading-relaxed dark:text-gray-300">
        Reduced.to provides a link management tool for modern marketing teams to create, share, and track short links ("the Product"). The
        Product is accessible at reduced.to and other domains and subdomains controlled by Us (collectively, "the Website").
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Fair Use</h2>
      <p class="leading-relaxed dark:text-gray-300">
        You are responsible for your use of the Service and for any content that you post or transmit through the Service. You may not use
        the Service for any malicious purpose, including but not limited to:
      </p>
      <ul class="list-disc list-inside dark:text-gray-300">
        <li>Phishing or scam websites</li>
        <li>Pornography or adult content</li>
        <li>Betting or gambling</li>
        <li>Copyright infringement</li>
      </ul>
      <p class="leading-relaxed dark:text-gray-300">
        We reserve the right to suspend or terminate your access to the Service if we determine, in our sole discretion, that you have
        violated these Terms of Service.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Intellectual Property Rights</h2>
      <p class="leading-relaxed dark:text-gray-300">
        You acknowledge and agree that the Service and its entire contents, features, and functionality, including but not limited to all
        information, software, code, text, displays, graphics, photographs, video, audio, design, presentation, selection, and arrangement,
        are owned by Us, our licensors, or other providers of such material and are protected by United States and international copyright,
        trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Shortlink Ownership</h2>
      <p class="leading-relaxed dark:text-gray-300">
        If you're using a default Reduced.to-owned domain (e.g. reduced.to), we reserve the right to reclaim the shortlink if needed,
        particularly if it is necessary for brand compliance, to prevent confusion among users, or to maintain the integrity and reputation
        of our Service.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Changes to these Terms</h2>
      <p class="leading-relaxed dark:text-gray-300">
        We reserve the right to revise and update these Terms of Service from time to time in our sole discretion. All changes are effective
        immediately when we post them, and apply to all access to and use of the Website thereafter. Your continued use of the Website
        following the posting of revised Terms of Service means that you accept and agree to the changes.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Refund Policy</h2>
      <p class="leading-relaxed dark:text-gray-300">
        We do not allow refunds of any kind. All sales are final. If you have any issues or concerns with the services, please contact us
        directly at ori@reduced.to to address and resolve the matter.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Usage of Reduced.to</h2>
      <p class="leading-relaxed dark:text-gray-300">
        You agree to use Reduced.to only for lawful purposes and in accordance with these Terms. You are solely responsible for the content
        of your links and for ensuring that your use of Reduced.to complies with all applicable laws and regulations. Reduced.to takes no
        responsibility for any illegal or unauthorized use of our service by you.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Compliance with Laws</h2>
      <p class="leading-relaxed dark:text-gray-300">
        You agree to comply with all applicable laws and regulations in connection with your use of Reduced.to. You are responsible for
        ensuring that your use of the service does not violate any laws or regulations, including but not limited to those related to
        intellectual property, data privacy, and online conduct.
      </p>
      <h2 class="text-lg font-bold mt-10 mb-2">Contact Information</h2>
      <p class="leading-relaxed dark:text-gray-300">
        Questions or comments about the Website or these Terms of Service may be directed to our team at ori@reduced.to.
      </p>
      <p class="leading-relaxed dark:text-gray-300 mt-10">
        By using Reduced.to, you acknowledge that you have read these Terms of Service, understood them, and agree to be bound by them. If
        you do not agree to these Terms of Service, you are not authorized to use the Service. We reserve the right to change these Terms of
        Service at any time, so please review them frequently.
      </p>
      <p class="leading-relaxed dark:text-gray-300 mt-5">Thank you for using Reduced.to!</p>
    </div>
  );
});

const year = new Date().getFullYear();
export const head: DocumentHead = {
  title: 'Reduced.to | Terms and Conditions',
  meta: [
    {
      name: 'title',
      content: `Reduced.to | Terms and Conditions`,
    },
    {
      name: 'description',
      content: `Reduced.to | Terms and Conditions ${year}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/terms-and-conditions',
    },
    {
      property: 'og:title',
      content: `Reduced.to | Terms and Conditions`,
    },
    {
      property: 'og:description',
      content: `Reduced.to | Terms and Conditions ${year}`,
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: `Reduced.to | Terms and Conditions`,
    },
    {
      property: 'twitter:description',
      content: `Reduced.to | Terms and Conditions ${year}`,
    },
  ],
};
