'use client';

import { useLocale } from 'next-intl';
import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MegaSaleBanner() {
  const locale = useLocale();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 13,
    minutes: 31,
    seconds: 33,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-100 to-pink-200 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-500" />
            <span className="text-lg font-bold text-red-600">
              {locale === 'en' ? 'Mega Sale' : 'تخفيضات كبرى'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="bg-white px-3 py-1 rounded shadow-sm">
              {String(timeLeft.days).padStart(2, '0')}d
            </span>
            <span className="bg-white px-3 py-1 rounded shadow-sm">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="bg-white px-3 py-1 rounded shadow-sm">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="bg-white px-3 py-1 rounded shadow-sm">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
