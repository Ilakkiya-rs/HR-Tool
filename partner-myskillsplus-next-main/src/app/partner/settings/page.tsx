'use client';

import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import ImageUploading, { ImageListType } from 'react-images-uploading';

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('partnerToken');
  }
  return null;
};

type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

export default function PartnerSettings() {
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    details_submitted: boolean;
    charges_enabled: boolean;
    payouts_enabled: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    channelName: '',
    websiteLink: '',
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [image, setImage] = useState<ImageListType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const [notification, setNotification] = useState<NotificationType | null>(null);

  // Auto-scroll to notification when it appears
  useEffect(() => {
    if (notification && notificationRef.current) {
      notificationRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [notification]);

  useEffect(() => {
    const checkStripeStatus = async () => {
      const token = getAccessToken();
      const partnerId = localStorage.getItem("partnerId");
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/stripe/account-status/${partnerId}/`, {
          method: 'GET',
          // headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStripeStatus(data);
        }
      } catch (error) {
        console.error('Error checking Stripe status:', error);
      }
    };

    checkStripeStatus();
  }, []);

  // Add a function to handle refresh onboarding
  const handleRefreshOnboarding = async () => {
    const token = getAccessToken();
    const partnerId = localStorage.getItem("partnerId");
    if (!token) return;

    setIsStripeLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/stripe/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partnerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.onboarding_url) {
          window.location.href = data.onboarding_url;
        } else if (data.status === 'completed') {
          setNotification({ message: 'Stripe account is fully set up!', type: 'success' });
          // Refresh status
          window.location.reload();
        }
      } else {
        setNotification({ message: 'Failed to refresh onboarding.', type: 'error' });
      }
    } catch (error) {
      console.error('Refresh onboarding error:', error);
      setNotification({ message: 'Error refreshing onboarding.', type: 'error' });
    } finally {
      setIsStripeLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAccessToken();
      const partnerId = localStorage.getItem("partnerId");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/profile/${partnerId}`, {
          // headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          channelName: data.channel_name || '',
          websiteLink: data.website_link || '',
        });

        if (data.logo_url && typeof data.logo_url === 'string' && data.logo_url.trim() !== '') {
          setLogoUrl(data.logo_url);
        } else {
          setLogoUrl(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotification({ message: 'Failed to load profile data.', type: 'error' });
      }
    };

    fetchProfile();
  }, []);

  const onImageChange = (imageList: ImageListType) => {
    setImage(imageList);
  };

  const handleUploadAvatar = async () => {
    if (image.length === 0 || !image[0].file) {
      setNotification({ message: 'Please select an image first.', type: 'error' });
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    const formData = new FormData();
    formData.append('file', image[0].file as File);

    setIsUploadingAvatar(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}files/upload-logo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok && result.logo_url) {
        setLogoUrl(result.logo_url);
        setImage([]);
        setNotification({ message: 'Avatar uploaded successfully!', type: 'success' });
      } else {
        setNotification({ message: 'Upload failed. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      setNotification({ message: 'Error uploading avatar.', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    const partnerId = localStorage.getItem("partnerId");
    if (!token) return;

    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/settings/update/${partnerId}/`, {
        method: 'POST',
        headers: {
          // Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          channel_name: formData.channelName,
          website_link: formData.websiteLink,
        }),
      });

      if (response.ok) {
        setNotification({ message: 'Settings updated successfully!', type: 'success' });
      } else {
        setNotification({ message: 'Failed to update settings.', type: 'error' });
      }
    } catch (err) {
      console.error('Update failed:', err);
      setNotification({ message: 'Error updating settings.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    const token = getAccessToken();
    const partnerId = localStorage.getItem("partnerId");
    if (!token) return;

    setIsStripeLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/stripe/connect-initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_id: partnerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.onboarding_url) {
          window.location.href = data.onboarding_url;
        } else {
          setNotification({
            message: 'Stripe Connect initiated, but no redirect URL found.',
            type: 'error',
          });
        }
      } else {
        setNotification({ message: 'Failed to initiate Stripe Connect.', type: 'error' });
      }
    } catch (error) {
      console.error('Stripe connect error:', error);
      setNotification({ message: 'Error initiating Stripe Connect.', type: 'error' });
    } finally {
      setIsStripeLoading(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!formData.email) {
      setNotification({ message: 'Email is missing or invalid.', type: 'error' });
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/partner/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setNotification({ message: 'Password reset email sent successfully.', type: 'success' });
      } else {
        setNotification({ message: 'Failed to request password reset.', type: 'error' });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setNotification({ message: 'Error requesting password reset.', type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    const token = getAccessToken();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}partner/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotification({ message: 'Account deleted successfully.', type: 'success' });
        localStorage.removeItem('partnerToken');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setNotification({ message: 'Failed to delete account.', type: 'error' });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setNotification({ message: 'Error deleting account.', type: 'error' });
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <Sidebar />
      <main className="flex-1 p-10 overflow-auto flex flex-col items-center space-y-16">
        {notification && (
          <div
            ref={notificationRef}
            className={`w-full max-w-2xl px-4 py-3 rounded mb-4 text-center
              ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-[#FFCDD2] text-[#C62828]'}`}
            role="alert"
          >
            {notification.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white p-8 rounded-lg shadow"
          noValidate
        >
          <h1 className="text-3xl font-bold text-[#212121] mb-8 text-center">Partner Settings</h1>

          {/* <div className="mb-8">

            <div className="flex justify-center">
              <ImageUploading
                multiple={false}
                value={image}
                onChange={onImageChange}
                dataURLKey="data_url"
                acceptType={['jpg', 'jpeg', 'png']}
                maxNumber={1}
              >
                {({ imageList, onImageUpload }) => {
                  const avatarSrc = imageList.length > 0 ? imageList[0].data_url : logoUrl;

                  return (
                    <div className="flex items-center space-x-6">
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center border-2
                ${avatarSrc ? 'border-[#E0E0E0]' : 'bg-blue-300 border-blue-500'}
                overflow-hidden`}
                      >
                        {avatarSrc && (
                          <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={() => setLogoUrl(null)}
                          />
                        )}
                      </div>

                      {!logoUrl && imageList.length === 0 && (
                        <button
                          type="button"
                          onClick={onImageUpload}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Choose Image
                        </button>
                      )}

                      {!logoUrl && imageList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleUploadAvatar}
                          disabled={isUploadingAvatar}
                          className={`px-4 py-2 rounded text-white ${isUploadingAvatar ? 'bg-[#BDBDBD]' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                          {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                        </button>
                      )}
                    </div>
                  );
                }}
              </ImageUploading>
            </div>
          </div> */}


          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#616161] mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#616161] mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md bg-[#F5F5F5] text-[#FAFAFA]0 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#616161] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md"
              />
            </div>

            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-[#616161] mb-1">
                Channel/Company Name
              </label>
              <input
                type="text"
                id="channelName"
                name="channelName"
                value={formData.channelName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md"
              />
            </div>

            <div>
              <label htmlFor="websiteLink" className="block text-sm font-medium text-[#616161] mb-1">
                Website/Group Link
              </label>
              <input
                type="url"
                id="websiteLink"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>


        {/* Stripe Connect Form */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center">Stripe Connect</h2>

          {stripeStatus && stripeStatus.connected ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className={`font-medium ${stripeStatus.details_submitted && stripeStatus.payouts_enabled
                    ? 'text-green-600'
                    : 'text-yellow-600'
                  }`}>
                  {stripeStatus.details_submitted && stripeStatus.payouts_enabled
                    ? '✅ Stripe account is fully connected and ready for payouts!'
                    : '⚠️ Stripe account setup is incomplete'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Details Submitted: {stripeStatus.details_submitted ? '✅' : '❌'}</div>
                <div>Payouts Enabled: {stripeStatus.payouts_enabled ? '✅' : '❌'}</div>
              </div>

              {(!stripeStatus.details_submitted || !stripeStatus.payouts_enabled) && (
                <button
                  onClick={handleRefreshOnboarding}
                  disabled={isStripeLoading}
                  className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 disabled:opacity-50"
                >
                  {isStripeLoading ? 'Loading...' : 'Complete Stripe Setup'}
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-6 text-center text-[#757575]">
                Connect your Stripe account to start receiving payouts.
              </p>
              <button
                onClick={handleConnectStripe}
                disabled={isStripeLoading}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isStripeLoading ? 'Connecting...' : 'Connect Stripe'}
              </button>
            </>
          )}
        </div>

        {/* Account Management */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-semibold text-center">Account Management</h2>
          <p className="text-center text-[#757575]">
            Manage sensitive account actions below. You can request a password change or permanently delete your account.
          </p>
          <button
            onClick={handleRequestPasswordReset}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-yellow-600"
          >
            Request Password Change
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-[#D32F2F]"
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}











