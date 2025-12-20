'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Truck, Clock, MapPin, Package, Shield, CreditCard } from 'lucide-react';

export default function ShippingPage() {
  const locale = useLocale() as 'en' | 'ar';

  const content = {
    en: {
      title: 'Shipping & Delivery',
      subtitle: 'Fast, reliable delivery across Saudi Arabia',
      sections: [
        {
          title: '1. Delivery Areas',
          content: 'We deliver to all major cities and regions across Saudi Arabia including Riyadh, Jeddah, Dammam, Mecca, Medina, Taif, Khobar, Dhahran, Abha, Tabuk, Buraidah, Khamis Mushait, Hail, Hafar Al-Batin, Jubail, Al-Kharj, Qatif, Al-Ahsa, Yanbu, and Jazan. For remote areas, additional delivery charges may apply.'
        },
        {
          title: '2. Delivery Times',
          content: 'Standard delivery takes 1-3 business days within major cities and 2-5 business days for other areas. Same-day delivery is available in Riyadh, Jeddah, and Dammam for orders placed before 2:00 PM. Express delivery (next day) is available for most areas with additional charges.'
        },
        {
          title: '3. Delivery Charges',
          content: 'Free delivery on orders over 200 SAR within major cities. Standard delivery charges: 15 SAR for orders under 200 SAR. Same-day delivery: 25 SAR additional charge. Express delivery: 20 SAR additional charge. Remote area delivery: 30-50 SAR depending on location.'
        },
        {
          title: '4. Special Handling',
          content: 'Fresh flowers and perishable items require special handling and are delivered within 24 hours of preparation. Temperature-controlled delivery is used for chocolates and delicate items during hot weather. Fragile items are packaged with extra care and protective materials.'
        },
        {
          title: '5. Delivery Process',
          content: 'You will receive SMS and email notifications when your order is confirmed, prepared, and out for delivery. Our delivery team will contact you 30 minutes before arrival. If you\'re not available, we will attempt redelivery the next business day at no extra charge.'
        },
        {
          title: '6. Order Tracking',
          content: 'Track your order in real-time through our website or mobile app. You will receive a tracking number via SMS and email once your order is dispatched. Live GPS tracking is available for same-day and express deliveries.'
        },
        {
          title: '7. Delivery Instructions',
          content: 'Please provide clear delivery instructions including building number, floor, and any access codes. For surprise deliveries, ensure the recipient will be available at the specified time. We can coordinate with building security or reception for office deliveries.'
        },
        {
          title: '8. Failed Delivery',
          content: 'If delivery fails due to incorrect address or recipient unavailability, we will contact you to reschedule. Additional delivery charges may apply for multiple failed attempts. Orders will be held for 48 hours before being returned to our facility.'
        }
      ]
    },
    ar: {
      title: 'الشحن والتوصيل',
      subtitle: 'توصيل سريع وموثوق في جميع أنحاء المملكة العربية السعودية',
      sections: [
        {
          title: '1. مناطق التوصيل',
          content: 'نقوم بالتوصيل إلى جميع المدن والمناطق الرئيسية في المملكة العربية السعودية بما في ذلك الرياض وجدة والدمام ومكة والمدينة والطائف والخبر والظهران وأبها وتبوك وبريدة وخميس مشيط وحائل وحفر الباطن والجبيل والخرج والقطيف والأحساء وينبع وجازان. بالنسبة للمناطق النائية، قد تطبق رسوم توصيل إضافية.'
        },
        {
          title: '2. أوقات التوصيل',
          content: 'التوصيل العادي يستغرق 1-3 أيام عمل داخل المدن الرئيسية و2-5 أيام عمل للمناطق الأخرى. التوصيل في نفس اليوم متاح في الرياض وجدة والدمام للطلبات المقدمة قبل الساعة 2:00 مساءً. التوصيل السريع (اليوم التالي) متاح لمعظم المناطق برسوم إضافية.'
        },
        {
          title: '3. رسوم التوصيل',
          content: 'توصيل مجاني للطلبات التي تزيد عن 200 ريال سعودي داخل المدن الرئيسية. رسوم التوصيل العادي: 15 ريال سعودي للطلبات أقل من 200 ريال. التوصيل في نفس اليوم: 25 ريال سعودي رسوم إضافية. التوصيل السريع: 20 ريال سعودي رسوم إضافية. توصيل المناطق النائية: 30-50 ريال سعودي حسب الموقع.'
        },
        {
          title: '4. المعالجة الخاصة',
          content: 'الزهور الطازجة والمنتجات القابلة للتلف تتطلب معالجة خاصة ويتم توصيلها خلال 24 ساعة من التحضير. يتم استخدام التوصيل المتحكم في درجة الحرارة للشوكولاتة والمنتجات الحساسة خلال الطقس الحار. يتم تغليف المنتجات الهشة بعناية إضافية ومواد واقية.'
        },
        {
          title: '5. عملية التوصيل',
          content: 'ستتلقى إشعارات عبر الرسائل النصية والبريد الإلكتروني عند تأكيد طلبك وتحضيره وخروجه للتوصيل. سيتصل بك فريق التوصيل قبل 30 دقيقة من الوصول. إذا لم تكن متاحاً، سنحاول إعادة التوصيل في يوم العمل التالي دون رسوم إضافية.'
        },
        {
          title: '6. تتبع الطلب',
          content: 'تتبع طلبك في الوقت الفعلي من خلال موقعنا الإلكتروني أو تطبيق الهاتف المحمول. ستتلقى رقم تتبع عبر الرسائل النصية والبريد الإلكتروني بمجرد إرسال طلبك. التتبع المباشر عبر نظام تحديد المواقع متاح للتوصيل في نفس اليوم والتوصيل السريع.'
        },
        {
          title: '7. تعليمات التوصيل',
          content: 'يرجى تقديم تعليمات توصيل واضحة بما في ذلك رقم المبنى والطابق وأي رموز دخول. للتوصيل المفاجئ، تأكد من أن المستلم سيكون متاحاً في الوقت المحدد. يمكننا التنسيق مع أمن المبنى أو الاستقبال لتوصيل المكاتب.'
        },
        {
          title: '8. فشل التوصيل',
          content: 'إذا فشل التوصيل بسبب عنوان غير صحيح أو عدم توفر المستلم، سنتصل بك لإعادة الجدولة. قد تطبق رسوم توصيل إضافية للمحاولات الفاشلة المتعددة. سيتم الاحتفاظ بالطلبات لمدة 48 ساعة قبل إعادتها إلى منشأتنا.'
        }
      ]
    }
  };

  const deliveryOptions = [
    {
      icon: Truck,
      title: locale === 'ar' ? 'التوصيل العادي' : 'Standard Delivery',
      time: locale === 'ar' ? '1-3 أيام عمل' : '1-3 Business Days',
      price: locale === 'ar' ? 'مجاني للطلبات +200 ريال' : 'Free for orders 200+ SAR',
      description: locale === 'ar' ? 'توصيل موثوق للمدن الرئيسية' : 'Reliable delivery to major cities'
    },
    {
      icon: Clock,
      title: locale === 'ar' ? 'التوصيل في نفس اليوم' : 'Same Day Delivery',
      time: locale === 'ar' ? 'خلال 6-8 ساعات' : 'Within 6-8 Hours',
      price: locale === 'ar' ? '+25 ريال' : '+25 SAR',
      description: locale === 'ar' ? 'للطلبات قبل 2:00 مساءً' : 'For orders before 2:00 PM'
    },
    {
      icon: Package,
      title: locale === 'ar' ? 'التوصيل السريع' : 'Express Delivery',
      time: locale === 'ar' ? 'اليوم التالي' : 'Next Day',
      price: locale === 'ar' ? '+20 ريال' : '+20 SAR',
      description: locale === 'ar' ? 'توصيل سريع لمعظم المناطق' : 'Fast delivery to most areas'
    }
  ];

  const currentContent = content[locale];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-light mb-3 tracking-tight">
                {currentContent.title}
              </h1>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                {currentContent.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Options */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-light text-neutral-900 mb-6">
                {locale === 'ar' ? 'خيارات التوصيل' : 'Delivery Options'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {deliveryOptions.map((option, index) => (
                <div key={index} className="bg-neutral-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    {option.time}
                  </p>
                  <p className="text-base font-semibold text-neutral-900 mb-3">
                    {option.price}
                  </p>
                  <p className="text-neutral-600 text-xs">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
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
              </div>
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl font-light text-neutral-900 mb-8 text-center">
                {locale === 'ar' ? 'خدمات إضافية' : 'Additional Services'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-3">
                    {locale === 'ar' ? 'ضمان التوصيل' : 'Delivery Guarantee'}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {locale === 'ar' 
                      ? 'نضمن وصول طلبك في الوقت المحدد أو نعيد رسوم التوصيل'
                      : 'We guarantee your order arrives on time or we refund delivery fees'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-3">
                    {locale === 'ar' ? 'تتبع مباشر' : 'Live Tracking'}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {locale === 'ar'
                      ? 'تتبع طلبك في الوقت الفعلي من التحضير حتى التسليم'
                      : 'Track your order in real-time from preparation to delivery'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-3">
                    {locale === 'ar' ? 'دفع عند التسليم' : 'Cash on Delivery'}
                  </h3>
                  <p className="text-neutral-600 text-sm">
                    {locale === 'ar'
                      ? 'ادفع نقداً أو بالبطاقة عند استلام طلبك'
                      : 'Pay cash or card when you receive your order'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}