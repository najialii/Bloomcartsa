'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  const locale = useLocale() as 'en' | 'ar';

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: December 11, 2025',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, payment information, and any other information you choose to provide.'
        },
        {
          title: '2. How We Use Your Information',
          content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, communicate with you about products and services, and comply with legal obligations. We may also use your information to personalize your experience and provide relevant recommendations.'
        },
        {
          title: '3. Information Sharing',
          content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our website and conducting our business, provided they agree to keep this information confidential.'
        },
        {
          title: '4. Data Security',
          content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.'
        },
        {
          title: '5. Cookies and Tracking',
          content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings, but disabling cookies may affect the functionality of our website.'
        },
        {
          title: '6. Third-Party Services',
          content: 'Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.'
        },
        {
          title: '7. Data Retention',
          content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.'
        },
        {
          title: '8. Your Rights',
          content: 'You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe.'
        },
        {
          title: '9. Children\'s Privacy',
          content: 'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.'
        },
        {
          title: '10. Changes to This Policy',
          content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.'
        }
      ]
    },
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: 11 ديسمبر 2025',
      sections: [
        {
          title: '1. المعلومات التي نجمعها',
          content: 'نحن نجمع المعلومات التي تقدمها لنا مباشرة، مثل عندما تنشئ حساباً أو تقوم بعملية شراء أو تشترك في نشرتنا الإخبارية أو تتصل بنا. قد تشمل هذه المعلومات اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وعنوان الشحن ومعلومات الدفع وأي معلومات أخرى تختار تقديمها.'
        },
        {
          title: '2. كيف نستخدم معلوماتك',
          content: 'نستخدم المعلومات التي نجمعها لتوفير وصيانة وتحسين خدماتنا، ومعالجة المعاملات، وإرسال الإشعارات التقنية ورسائل الدعم، والتواصل معك حول المنتجات والخدمات، والامتثال للالتزامات القانونية. قد نستخدم أيضاً معلوماتك لتخصيص تجربتك وتقديم توصيات ذات صلة.'
        },
        {
          title: '3. مشاركة المعلومات',
          content: 'نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف ثالثة دون موافقتك، باستثناء ما هو موضح في هذه السياسة. قد نشارك معلوماتك مع مقدمي الخدمات الذين يساعدوننا في تشغيل موقعنا الإلكتروني وإدارة أعمالنا، بشرط أن يوافقوا على الحفاظ على سرية هذه المعلومات.'
        },
        {
          title: '4. أمان البيانات',
          content: 'نحن نطبق تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو التخزين الإلكتروني آمنة بنسبة 100%، لذلك لا يمكننا ضمان الأمان المطلق.'
        },
        {
          title: '5. ملفات تعريف الارتباط والتتبع',
          content: 'نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين تجربة التصفح الخاصة بك، وتحليل حركة المرور على الموقع، وفهم من أين يأتي زوارنا. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك، ولكن تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف موقعنا الإلكتروني.'
        },
        {
          title: '6. خدمات الطرف الثالث',
          content: 'قد يحتوي موقعنا الإلكتروني على روابط لمواقع أو خدمات طرف ثالث. نحن لسنا مسؤولين عن ممارسات الخصوصية لهذه الأطراف الثالثة. نشجعك على قراءة سياسات الخصوصية الخاصة بهم قبل تقديم أي معلومات شخصية.'
        },
        {
          title: '7. الاحتفاظ بالبيانات',
          content: 'نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضرورياً لتحقيق الأغراض المحددة في هذه السياسة، ما لم تكن هناك حاجة لفترة احتفاظ أطول أو يسمح بها القانون. عندما لا نعود بحاجة إلى معلوماتك، سنقوم بحذفها بشكل آمن أو إخفاء هويتها.'
        },
        {
          title: '8. حقوقك',
          content: 'لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها. يمكنك أيضاً إلغاء الاشتراك في بعض الاتصالات منا. لممارسة هذه الحقوق، يرجى الاتصال بنا باستخدام المعلومات المقدمة أدناه. سنرد على طلبك في إطار زمني معقول.'
        },
        {
          title: '9. خصوصية الأطفال',
          content: 'خدماتنا غير مخصصة للأطفال دون سن 13 عاماً. نحن لا نجمع عن علم معلومات شخصية من الأطفال دون سن 13. إذا علمنا أننا جمعنا معلومات شخصية من طفل دون سن 13، فسنتخذ خطوات لحذف هذه المعلومات.'
        },
        {
          title: '10. التغييرات على هذه السياسة',
          content: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث". استمرارك في استخدام خدماتنا بعد أي تغييرات يشكل قبولاً للسياسة المحدثة.'
        }
      ]
    }
  };

  const currentContent = content[locale];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-neutral-900 mb-2">
              {currentContent.title}
            </h1>
            <p className="text-neutral-500 text-xs">
              {currentContent.lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <div className="prose prose-sm max-w-none">
                {currentContent.sections.map((section, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h2 className="text-lg font-medium text-neutral-900 mb-3 pb-1 border-b border-neutral-100">
                      {section.title}
                    </h2>
                    <p className="text-neutral-700 leading-relaxed text-sm">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-neutral-200 bg-neutral-50 p-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  {locale === 'en' ? 'Contact Us About Privacy' : 'اتصل بنا حول الخصوصية'}
                </h3>
                <p className="text-neutral-600 mb-4 text-xs">
                  {locale === 'en' 
                    ? 'If you have any questions about this Privacy Policy or our data practices, please contact us:'
                    : 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، يرجى الاتصال بنا:'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                    <span className="text-neutral-600">privacy@bloomcart.sa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                    <span className="text-neutral-600">+966 11 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                    <span className="text-neutral-600">
                      {locale === 'en' ? 'Riyadh, Saudi Arabia' : 'الرياض، السعودية'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}