"use client";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../components/MuiSnackbar";
import {
  updateNotificationPreferences,
  type NotificationPreferences,
} from "../../lib/firebase/users";

export default function SettingsPage() {
  const { user, profile, loading } = useAuth();
  const { showMessage } = useSnackbar();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreferences>({
      emailNotifications: false,
      smsNotifications: false,
      phoneNumber: "",
    });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile?.notificationPreferences) {
      setNotificationPrefs(profile.notificationPreferences);
    }
  }, [profile]);

  const handleSaveNotifications = async () => {
    if (!user) return;

    // Validate phone number if SMS is enabled
    if (notificationPrefs.smsNotifications && !notificationPrefs.phoneNumber) {
      showMessage("Please enter a phone number for SMS notifications", "error");
      return;
    }

    setSaving(true);
    try {
      await updateNotificationPreferences(user.uid, notificationPrefs);
      showMessage("Notification preferences saved successfully!", "success");
    } catch (error) {
      console.error("Error saving preferences:", error);
      showMessage("Failed to save preferences. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-200 dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary dark:text-tertiary mb-8">
          Settings
        </h1>

        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-tertiary"
                />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Display Name
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user.displayName || "Not set"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User ID
              </p>
              <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {user.uid}
              </p>
            </div>
            {profile?.role && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <span className="inline-block mt-1 px-3 py-1 bg-tertiary text-primary text-sm font-medium rounded-full">
                  {profile.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Dark Mode
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toggle using the button in the bottom-left corner
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Notification Preferences
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Get notified when new articles are published
          </p>
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={notificationPrefs.emailNotifications}
                onChange={(e) =>
                  setNotificationPrefs({
                    ...notificationPrefs,
                    emailNotifications: e.target.checked,
                  })
                }
                className="mt-1 h-5 w-5 text-tertiary focus:ring-tertiary border-gray-300 rounded"
              />
              <div className="flex-1">
                <label
                  htmlFor="emailNotifications"
                  className="block font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  Email Notifications
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Receive email alerts when an author publishes a new article.
                  Emails will be sent to: <strong>{user.email}</strong>
                </p>
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={notificationPrefs.smsNotifications}
                  onChange={(e) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      smsNotifications: e.target.checked,
                    })
                  }
                  className="mt-1 h-5 w-5 text-tertiary focus:ring-tertiary border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label
                    htmlFor="smsNotifications"
                    className="block font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    SMS Notifications
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Receive text message alerts for new articles
                  </p>
                </div>
              </div>
              {notificationPrefs.smsNotifications && (
                <div className="ml-9">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={notificationPrefs.phoneNumber || ""}
                    onChange={(e) =>
                      setNotificationPrefs({
                        ...notificationPrefs,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="+1234567890"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-slate-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-tertiary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveNotifications}
              disabled={saving}
              className="px-6 py-2 bg-tertiary text-primary font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Notification Preferences"}
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account
          </h2>
          <button
            disabled
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded cursor-not-allowed opacity-50"
          >
            Delete Account (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
