'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Bell, Lock, Globe, Trash2, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserStore } from '@/lib/userStore';

export default function SettingsPage() {
  const locale = useLocale() as 'en' | 'ar';
  const router = useRouter();
  const { profile, isLoggedIn } = useUserStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    language: locale,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/${locale}/login`);
    }
  }, [isLoggedIn, locale, router]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      // TODO: API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSuccessMessage(locale === 'en' ? 'Settings saved successfully!' : 'تم حفظ الإعدادات بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError(locale === 'en' ? 'All fields are required' : 'جميع الحقول مطلوبة');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(locale === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError(locale === 'en' ? 'Password must be at least 8 characters' : 'يجب أن تكون كلمة المرور 8 أحرف على الأقل');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          new_password_confirmation: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors?.current_password) {
          setPasswordError(locale === 'en' ? 'Current password is incorrect' : 'كلمة المرور الحالية غير صحيحة');
        } else {
          setPasswordError(data.message || (locale === 'en' ? 'Failed to change password' : 'فشل تغيير كلمة المرور'));
        }
        return;
      }
      
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage(locale === 'en' ? 'Password changed successfully!' : 'تم تغيير كلمة المرور بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(locale === 'en' ? 'Failed to change password' : 'فشل تغيير كلمة المرور');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: API call to delete account
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Logout and redirect
      useUserStore.getState().logout();
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href={`/${locale}/account`}
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              {locale === 'en' ? 'Back to Account' : 'العودة إلى الحساب'}
            </span>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              {locale === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
            </h1>
            <p className="text-neutral-600 text-lg">
              {locale === 'en' ? 'Manage your preferences and security' : 'إدارة تفضيلاتك وأمانك'}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Notifications */}
          <div className="bg-white border border-neutral-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5" />
              <h2 className="text-xl font-bold">
                {locale === 'en' ? 'Notifications' : 'الإشعارات'}
              </h2>
            </div>
            <div className="space-y-1">
              <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0">
                <div>
                  <div className="font-medium mb-1">
                    {locale === 'en' ? 'Email notifications' : 'إشعارات البريد الإلكتروني'}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {locale === 'en' ? 'Receive email updates about your account' : 'تلقي تحديثات البريد الإلكتروني حول حسابك'}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="w-5 h-5 accent-black cursor-pointer" 
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0">
                <div>
                  <div className="font-medium mb-1">
                    {locale === 'en' ? 'Order updates' : 'تحديثات الطلبات'}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {locale === 'en' ? 'Get notified about order status changes' : 'احصل على إشعارات حول تغييرات حالة الطلب'}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.orderUpdates}
                  onChange={(e) => setSettings({...settings, orderUpdates: e.target.checked})}
                  className="w-5 h-5 accent-black cursor-pointer" 
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <div className="font-medium mb-1">
                    {locale === 'en' ? 'Promotional emails' : 'رسائل ترويجية'}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {locale === 'en' ? 'Receive special offers and promotions' : 'تلقي العروض الخاصة والعروض الترويجية'}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.promotionalEmails}
                  onChange={(e) => setSettings({...settings, promotionalEmails: e.target.checked})}
                  className="w-5 h-5 accent-black cursor-pointer" 
                />
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white border border-neutral-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5" />
              <h2 className="text-xl font-bold">
                {locale === 'en' ? 'Security' : 'الأمان'}
              </h2>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full border border-neutral-300 p-4 text-left font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-all flex items-center justify-between group"
              >
                <span>{locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}</span>
                <ArrowLeft className="w-4 h-4 rotate-180 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </button>
              <button className="w-full border border-neutral-300 p-4 text-left font-medium hover:border-neutral-400 hover:bg-neutral-50 transition-all flex items-center justify-between group">
                <span>{locale === 'en' ? 'Two-Factor Authentication' : 'المصادقة الثنائية'}</span>
                <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 font-medium">
                  {locale === 'en' ? 'Coming Soon' : 'قريباً'}
                </span>
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white border border-neutral-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5" />
              <h2 className="text-xl font-bold">
                {locale === 'en' ? 'Language & Region' : 'اللغة والمنطقة'}
              </h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2">
                {locale === 'en' ? 'Preferred Language' : 'اللغة المفضلة'}
              </label>
              <select 
                value={settings.language}
                onChange={(e) => {
                  const newLang = e.target.value as 'en' | 'ar';
                  setSettings({...settings, language: newLang});
                  router.push(`/${newLang}/account/settings`);
                }}
                className="w-full border border-neutral-300 p-3 font-medium bg-white hover:border-neutral-400 focus:outline-none focus:border-black transition-colors"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-red-600">
                {locale === 'en' ? 'Danger Zone' : 'منطقة الخطر'}
              </h2>
            </div>
            <p className="text-sm text-neutral-700 mb-4">
              {locale === 'en' 
                ? 'Once you delete your account, there is no going back. Please be certain.' 
                : 'بمجرد حذف حسابك، لا يمكن التراجع. يرجى التأكد.'}
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="border border-red-600 text-red-600 px-6 py-2 font-medium hover:bg-red-600 hover:text-white transition-colors"
            >
              {locale === 'en' ? 'Delete Account' : 'حذف الحساب'}
            </button>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full bg-black text-white p-4 font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSaving 
              ? (locale === 'en' ? 'Saving...' : 'جاري الحفظ...') 
              : (locale === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
          </button>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-6">
              {locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
            </h3>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {passwordError}
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'en' ? 'Current Password' : 'كلمة المرور الحالية'}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full border border-neutral-300 p-3 pr-10 focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full border border-neutral-300 p-3 pr-10 focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'en' ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-black"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="flex-1 border border-neutral-300 py-3 font-medium hover:bg-neutral-50 transition-colors"
              >
                {locale === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-black text-white py-3 font-medium hover:bg-neutral-800 transition-colors"
              >
                {locale === 'en' ? 'Change Password' : 'تغيير كلمة المرور'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4 text-red-600">
              {locale === 'en' ? 'Delete Account' : 'حذف الحساب'}
            </h3>
            <p className="text-neutral-700 mb-6">
              {locale === 'en' 
                ? 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.' 
                : 'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع بياناتك نهائياً.'}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-neutral-300 py-3 font-medium hover:bg-neutral-50 transition-colors"
              >
                {locale === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-3 font-medium hover:bg-red-700 transition-colors"
              >
                {locale === 'en' ? 'Delete Account' : 'حذف الحساب'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
