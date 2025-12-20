'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BannerData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  mobile_image_url?: string;
  link_url?: string;
  link_text?: string;
  background_color?: string;
  text_color?: string;
  text_alignment: string;
}

interface BannerProps {
  type: 'promotional' | 'category_banner' | 'sidebar_banner' | 'footer_banner';
  position?: 'top' | 'middle' | 'bottom' | 'left' | 'right' | 'center';
  className?: string;
  limit?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Banner({ type, position, className = '', limit }: BannerProps) {
  const locale = useLocale();
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const params = new URLSearchParams();
        if (position) params.append('position', position);

        const response = await fetch(`${API_BASE_URL}/banners/type/${type}?${params}`, {
          headers: {
            'Accept-Language': locale,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            let bannersData = result.data || [];
            if (limit) {
              bannersData = bannersData.slice(0, limit);
            }
            setBanners(bannersData);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${type} banners:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [type, position, locale, limit]);

  if (loading) {
    // Don't show loading skeleton to prevent flash
    return null;
  }

  if (banners.length === 0) {
    return null;
  }

  // For sidebar banners, show them stacked
  if (type === 'sidebar_banner') {
    return (
      <div className={`space-y-4 ${className}`}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative overflow-hidden rounded-lg shadow-sm"
            style={{ backgroundColor: banner.background_color || '#f8f9fa' }}
          >
            {banner.image_url && (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div 
                className={`text-center p-4 ${
                  banner.text_alignment === 'left' ? 'text-left' :
                  banner.text_alignment === 'right' ? 'text-right' :
                  'text-center'
                }`}
              >
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: banner.text_color || '#ffffff' }}
                >
                  {banner.title}
                </h3>
                {banner.description && (
                  <p 
                    className="text-sm mb-3 opacity-90"
                    style={{ color: banner.text_color || '#ffffff' }}
                  >
                    {banner.description}
                  </p>
                )}
                {banner.link_url && banner.link_text && (
                  <Link
                    href={banner.link_url}
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    style={{ color: banner.text_color || '#ffffff' }}
                  >
                    {banner.link_text}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // For promotional and category banners, show them in a grid or single banner
  return (
    <div className={`${className} ${banners.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="relative overflow-hidden rounded-lg shadow-sm"
          style={{ backgroundColor: banner.background_color || '#f8f9fa' }}
        >
          {banner.image_url && (
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-32 md:h-40 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
            <div 
              className={`p-6 w-full ${
                banner.text_alignment === 'left' ? 'text-left' :
                banner.text_alignment === 'right' ? 'text-right' :
                'text-center'
              }`}
            >
              <h3 
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: banner.text_color || '#ffffff' }}
              >
                {banner.title}
              </h3>
              {banner.description && (
                <p 
                  className="text-sm md:text-base mb-4 opacity-90"
                  style={{ color: banner.text_color || '#ffffff' }}
                >
                  {banner.description}
                </p>
              )}
              {banner.link_url && banner.link_text && (
                <Link
                  href={banner.link_url}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors font-medium text-sm rounded-lg"
                >
                  {banner.link_text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}