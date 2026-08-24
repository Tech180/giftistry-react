import { useEffect } from 'react';
import { useToast } from 'app/providers/toast-context';
import { useUserSocket } from 'app/providers/user-socket-context';
import { claimJobNotificationToast } from '../utils/claim-job-notification-toast.util';
import { mapNotification } from '../utils/map-notification.util';

function isJobNotification(type: string): boolean {
  return type === 'job_completed' || type === 'job_failed';
}

/**
 * Shows a toast when a job completion notification arrives over the user socket,
 * unless the wishlist page already handled that job (on-page dedupe).
 */
export function useJobNotificationToast(): void {
  const { showToast } = useToast();
  const { addEventListener, removeEventListener } = useUserSocket();

  useEffect(() => {
    const handleNotification = (data: { Notification?: unknown }) => {
      if (!data?.Notification) return;
      const notification = mapNotification(
        data.Notification as Parameters<typeof mapNotification>[0]
      );
      if (!isJobNotification(notification.Type)) {
        return;
      }

      const jobId = notification.Metadata?.JobId;
      if (jobId && !claimJobNotificationToast(jobId, notification.Type)) {
        return;
      }

      const tone = notification.Type === 'job_failed' ? 'error' : 'success';
      const message =
        notification.Message?.trim() ||
        notification.Title?.trim() ||
        (notification.Type === 'job_failed'
          ? 'Background item job failed.'
          : 'Background item job finished.');
      showToast(message, tone);
    };

    addEventListener('notification.received', handleNotification);
    return () => {
      removeEventListener('notification.received', handleNotification);
    };
  }, [addEventListener, removeEventListener, showToast]);
}
