import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import CartModal from '@/components/CartModal';
import WishlistModal from '@/components/WishlistModal';
import ToastContainer from '@/components/ToastContainer';
import { PlatformSettingsProvider } from '@/contexts/PlatformSettingsContext';
import '../globals.css';

export const metadata = {
  title: 'BloomCart - Elegant Gifts & Flowers',
  description: 'Discover elegant gifts and beautiful flowers for every occasion',
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Set direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <PlatformSettingsProvider>
            {children}
            <CartModal />
            <WishlistModal />
            <ToastContainer />
          </PlatformSettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
