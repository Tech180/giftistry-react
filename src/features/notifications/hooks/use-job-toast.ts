import { useEffect } from 'react';
import { useToast } from 'shared/providers/toast';
import { useUserSocket } from 'shared/providers/user-socket';
import { JOB_TOAST_MESSAGES } from '../constants/job-toast-messages.constant';
import type { NotificationSocketPayload } from '../interfaces/notification-socket-payload.interface';
import { claimJobNotificationToast } from '../utils/claim-job-notification-toast.util';
import { isJobNotification } from '../utils/is-job-notification.util';
import { mapNotification } from '../utils/map-notification.util';

/**
 * Shows a toast when a job completion notification arrives over the user socket,
 * unless the wishlist page already handled that job (on-page dedupe).
 */
export function useJobToast(): void {
  const { showToast } = useToast();
  const { addEventListener, removeEventListener } = useUserSocket();

  useEffect(() => {
    const handleNotification = (data: unknown) => {
      const payload = data as NotificationSocketPayload;
      if (!payload?.Notification) {
        return;
      }

      const notification = mapNotification(payload.Notification);
      if (!isJobNotification(notification.Type)) {
        return;
      }

      const jobId = notification.Metadata?.JobId;
      if (jobId && !claimJobNotificationToast(jobId, notification.Type)) {
        return;
      }

      const softFailure = notification.Metadata?.SoftFailure === 'true';
      const tone =
        notification.Type === 'job_failed' ? 'error' : softFailure ? 'info' : 'success';
      const message =
        notification.Message?.trim() ||
        notification.Title?.trim() ||
        (notification.Type === 'job_failed'
          ? JOB_TOAST_MESSAGES.failed
          : softFailure
            ? JOB_TOAST_MESSAGES.softFailure
            : JOB_TOAST_MESSAGES.completed);
      showToast(message, tone);
    };

    addEventListener('notification.received', handleNotification);
    return () => {
      removeEventListener('notification.received', handleNotification);
    };
  }, [addEventListener, removeEventListener, showToast]);
}
