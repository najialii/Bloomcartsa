'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const locale = useLocale() as 'en' | 'ar';

  const content = {
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: December 11, 2025',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using BloomCart SA, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
        },
        {
          title: '2. Use License',
          content: 'Permission is granted to temporarily download one copy of the materials on BloomCart SA for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the website; remove any copyright or other proprietary notations from the materials.'
        },
        {
          title: '3. Disclaimer',
          content: 'The materials on BloomCart SA are provided on an "as is" basis. BloomCart SA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
        },
        {
          title: '4. Limitations',
          content: 'In no event shall BloomCart SA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BloomCart SA, even if BloomCart SA or an authorized representative has been notified orally or in writing of the possibility of such damage.'
        },
        {
          title: '5. Privacy Policy',
          content: 'Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.'
        },
        {
          title: '6. Product Information',
          content: 'We strive to provide accurate product information, including descriptions, prices, and availability. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Prices and availability are subject to change without notice.'
        },
        {
          title: '7. Orders and Payment',
          content: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payment must be made in full before delivery. We accept various payment methods as indicated on our website.'
        },
        {
          title: '8. Delivery',
          content: 'We will make every effort to deliver products within the specified timeframe. However, delivery times are estimates and we are not liable for delays caused by circumstances beyond our control, including but not limited to weather conditions, traffic, or other unforeseen events.'
        },
        {
          title: '9. Returns and Refunds',
          content: 'Due to the perishable nature of our products (flowers, chocolates, etc.), returns are generally not accepted unless the product is damaged or defective upon delivery. Please contact us within 24 hours of delivery for any issues.'
        },
        {
          title: '10. Governing Law',
          content: 'These terms and conditions are governed by and construed in accordance with the laws of Saudi Arabia and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.'
        }
      ]
    },
    ar: {
      title: 'الشروط والأحكام',
      lastUpdated: 'آخر تحديث: 11 ديسمبر 2025',
      sections: [
        {
          title: '1. قبول الشروط',
          content: 'من خلال الوصول إلى واستخدام بلوم كارت السعودية، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على الالتزام بما ورد أعلاه، يرجى عدم استخدام هذه الخدمة.'
        },
        {
          title: '2. ترخيص الاستخدام',
          content: 'يُمنح الإذن بتنزيل نسخة واحدة مؤقتة من المواد الموجودة على بلوم كارت السعودية للعرض الشخصي غير التجاري المؤقت فقط. هذا منح ترخيص وليس نقل ملكية، وبموجب هذا الترخيص لا يجوز لك: تعديل أو نسخ المواد؛ استخدام المواد لأي غرض تجاري أو لأي عرض عام؛ محاولة الهندسة العكسية لأي برنامج موجود على الموقع؛ إزالة أي حقوق طبع ونشر أو ملاحظات ملكية أخرى من المواد.'
        },
        {
          title: '3. إخلاء المسؤولية',
          content: 'يتم توفير المواد على بلوم كارت السعودية على أساس "كما هي". لا تقدم بلوم كارت السعودية أي ضمانات، صريحة أو ضمنية، وتخلي بموجب هذا مسؤوليتها وتنفي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط القابلية للتسويق أو الملاءمة لغرض معين أو عدم انتهاك الملكية الفكرية أو انتهاك آخر للحقوق.'
        },
        {
          title: '4. القيود',
          content: 'في أي حال من الأحوال لن تكون بلوم كارت السعودية أو مورديها مسؤولين عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الربح، أو بسبب انقطاع الأعمال) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على بلوم كارت السعودية، حتى لو تم إخطار بلوم كارت السعودية أو ممثل مخول شفهياً أو كتابياً بإمكانية حدوث مثل هذا الضرر.'
        },
        {
          title: '5. سياسة الخصوصية',
          content: 'خصوصيتك مهمة بالنسبة لنا. نحن نجمع ونستخدم معلوماتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا. باستخدام خدماتنا، فإنك توافق على جمع واستخدام معلوماتك كما هو موضح في سياسة الخصوصية الخاصة بنا.'
        },
        {
          title: '6. معلومات المنتج',
          content: 'نسعى جاهدين لتوفير معلومات دقيقة عن المنتج، بما في ذلك الأوصاف والأسعار والتوفر. ومع ذلك، لا نضمن أن أوصاف المنتج أو المحتوى الآخر دقيق أو كامل أو موثوق أو حديث أو خالٍ من الأخطاء. الأسعار والتوفر عرضة للتغيير دون إشعار.'
        },
        {
          title: '7. الطلبات والدفع',
          content: 'جميع الطلبات تخضع للقبول والتوفر. نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب. يجب دفع المبلغ كاملاً قبل التسليم. نقبل طرق دفع متنوعة كما هو موضح على موقعنا الإلكتروني.'
        },
        {
          title: '8. التسليم',
          content: 'سنبذل قصارى جهدنا لتسليم المنتجات خلال الإطار الزمني المحدد. ومع ذلك، أوقات التسليم تقديرية ولسنا مسؤولين عن التأخير الناجم عن ظروف خارجة عن سيطرتنا، بما في ذلك على سبيل المثال لا الحصر الأحوال الجوية أو حركة المرور أو أحداث أخرى غير متوقعة.'
        },
        {
          title: '9. المرتجعات والاسترداد',
          content: 'نظراً للطبيعة القابلة للتلف لمنتجاتنا (الزهور والشوكولاتة وما إلى ذلك)، لا يتم قبول المرتجعات عموماً إلا إذا كان المنتج تالفاً أو معيباً عند التسليم. يرجى الاتصال بنا خلال 24 ساعة من التسليم لأي مشاكل.'
        },
        {
          title: '10. القانون الحاكم',
          content: 'تخضع هذه الشروط والأحكام وتُفسر وفقاً لقوانين المملكة العربية السعودية وأنت تخضع بشكل لا رجعة فيه للاختصاص الحصري للمحاكم في تلك الدولة أو الموقع.'
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
                  {locale === 'en' ? 'Contact Us' : 'اتصل بنا'}
                </h3>
                <p className="text-neutral-600 mb-4 text-xs">
                  {locale === 'en' 
                    ? 'If you have any questions about these Terms and Conditions, please contact us:'
                    : 'إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا:'
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                    <span className="text-neutral-600">support@bloomcart.sa</span>
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