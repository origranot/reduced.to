import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="text-left h-[calc(100vh-64px)] pt-8 md:container md:mx-auto mx-5">
      <h1 class="text-5xl font-bold my-8">Privacy policy</h1>
      <p class="leading-relaxed dark:text-gray-300">
        This privacy policy ("Policy") describes how Website Operator ("Website Operator", "we", "us", or "our") collects, protects, and
        uses the personally identifiable information ("Personal Information") you ("User", "you", or "your") may provide on the reduced.to
        website and any of its products or services (collectively, "Website" or "Services"). It also describes the choices available to you
        regarding our use of your Personal Information and how you can access and update this information. This Policy does not apply to the
        practices of companies that we do not own or control, or to individuals that we do not employ or manage.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Automatic collection of information</h2>
      <p class="leading-relaxed dark:text-gray-300">
        When you visit the Website, our servers automatically record information that your browser sends. This data may include information
        such as your device's IP address, browser type and version, operating system type and version, language preferences, or the webpage
        you were visiting before you came to our Website, pages of our Website that you visit, the time spent on those pages, information
        you search for on our Website, access times and dates, and other statistics.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Collection of personal information</h2>
      <p class="leading-relaxed dark:text-gray-300">
        You can visit the Website without telling us who you are or revealing any information by which someone could identify you as a
        specific, identifiable individual. If, however, you wish to use some of the Website's features, you will be asked to provide certain
        Personal Information (for example, your name and e-mail address). We receive and store any information you knowingly provide to us
        when you create an account or fill any online forms on the Website. When required, this information may include the following:
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Log data</h2>
      <p class="leading-relaxed dark:text-gray-300">
        We collect information that your browser sends whenever you visit our Website ("Log Data"). This Log Data may include information
        such as your device's Internet Protocol ("IP") address, browser type, browser version, the pages of our Website that you visit, the
        time and date of your visit, the time spent on those pages, and other statistics.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Cookies</h2>
      <p class="leading-relaxed dark:text-gray-300">
        We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data that our
        website stores on your computer and accesses each time you visit, so we can understand how you use our site. This helps us serve you
        content based on preferences you have specified. Please refer to our Cookie Policy for more information.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Data storage</h2>
      <p class="leading-relaxed dark:text-gray-300">
        We use third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related
        technology required to run the Website. Although we own the code, databases, and all rights to the Website, you retain all rights to
        your data.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">How we use your information</h2>
      <div class="leading-relaxed space-y-1 dark:text-gray-300">
        <p class="">We may use the information we collect in various ways, including but not limited to:</p>
        <ul class="list-disc list-inside">
          <li>Providing and personalizing our services to enhance user experience and optimize website performance.</li>
          <li>Communicating with you regarding updates, notifications, and support-related matters.</li>
          <li>Analyzing user behavior and preferences to improve our website and services.</li>
          <li>Detecting and preventing fraudulent activities to ensure the security of our users and the website.</li>
        </ul>
        <span class="text-sm">
          Please note that this is not an exhaustive list, and the information collected may be used for other legitimate purposes
          consistent with the context of the data collection.
        </span>
      </div>

      <h2 class="text-lg font-bold mt-10 mb-2">Children's privacy</h2>
      <p class="leading-relaxed dark:text-gray-300">
        This Website is not intended for use by children under the age of 13, and we do not knowingly collect or use any Personal
        Information from such children. If we become aware that we have unknowingly collected Personal Information from a child under the
        age of 13, we will make commercially reasonable efforts to delete such Personal Information from our database.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Changes and amendments</h2>
      <p class="leading-relaxed dark:text-gray-300">
        We reserve the right to modify this Policy relating to the Website or Services at any time, effective upon posting an updated
        version of this Policy on the Website. When we do, we will revise the updated date at the bottom of this page. Continued use of the
        Website after any such changes shall constitute your consent to such changes.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Acceptance of this policy</h2>
      <p class="leading-relaxed dark:text-gray-300">
        You acknowledge that you have read this Policy and agree to all its terms and conditions. By using the Website or its Services, you
        agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to use or access
        the Website and its Services.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Open source and modifications</h2>
      <p class="leading-relaxed dark:text-gray-300">
        This project is open source under MIT{' '}
        <a class="underline" href="https://github.com/origranot/reduced.to/blob/master/LICENSE">
          license
        </a>
        . Anyone under the license can use and modify this project according to the terms specified in the license. However, this privacy
        policy applies specifically to the services provided by reduced.to and does not cover modifications made by individual users or
        third parties to their respective instances of the project.
      </p>

      <h2 class="text-lg font-bold mt-10 mb-2">Contacting us</h2>
      <p class="pb-8 leading-relaxed dark:text-gray-300">
        If you have any questions or concerns regarding this Privacy Policy, please contact us at our{' '}
        <a class="underline" href="https://github.com/origranot/reduced.to">
          Github
        </a>
      </p>
    </div>
  );
});

const year = new Date().getFullYear();
export const head: DocumentHead = {
  title: 'Reduced.to | Privacy Policy',
  meta: [
    {
      name: 'title',
      content: `Reduced.to | Privacy Policy`,
    },
    {
      name: 'description',
      content: `Reduced.to | Privacy Policy ${year}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/privacy-policy',
    },
    {
      property: 'og:title',
      content: `Reduced.to | Privacy Policy`,
    },
    {
      property: 'og:description',
      content: `Reduced.to | Privacy Policy ${year}`,
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: `Reduced.to | Privacy Policy`,
    },
    {
      property: 'twitter:description',
      content: `Reduced.to | Privacy Policy ${year}`,
    },
  ],
};
