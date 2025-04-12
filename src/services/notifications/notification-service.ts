import { BaseNotificationData, NotificationChannel, NotificationProvider, SessionNotificationData } from './types';
import { AfricasTalkingSmsProvider } from './providers/africas-talking';
import { EmailProvider } from './providers/email';

/**
 * Service for handling notifications across different channels
 */
export class NotificationService {
  private providers: Map<NotificationChannel, NotificationProvider>;

  constructor() {
    this.providers = new Map();
    
    // Initialize providers
    this.providers.set('sms', new AfricasTalkingSmsProvider());
    this.providers.set('email', new EmailProvider());
  }

  /**
   * Check if a specific notification channel is available
   * @param channel The notification channel to check
   * @returns True if the channel is available
   */
  isChannelAvailable(channel: NotificationChannel): boolean {
    const provider = this.providers.get(channel);
    return !!provider && provider.isAvailable();
  }

  /**
   * Send a notification through a specific channel
   * @param channel The channel to use for the notification
   * @param data The notification data
   * @returns Result of the send operation
   */
  async sendNotification(
    channel: NotificationChannel,
    data: BaseNotificationData
  ): Promise<{ success: boolean; error?: string }> {
    const provider = this.providers.get(channel);
    
    if (!provider) {
      return {
        success: false,
        error: `Provider for channel "${channel}" not implemented`
      };
    }
    
    if (!provider.isAvailable()) {
      return {
        success: false,
        error: `Provider for channel "${channel}" is not available or not configured`
      };
    }
    
    return provider.send(data);
  }

  /**
   * Send a session notification to both therapist and patient through specified channels
   * @param session The session data
   * @param channels The notification channels to use (default: ['sms', 'email'])
   * @returns Results of the send operations
   */
  async sendSessionNotifications(
    session: {
      _id: string;
      patientId: string;
      patientName: string;
      patientEmail?: string;
      patientPhone?: string;
      therapistId: string;
      therapistName: string;
      therapistEmail?: string;
      therapistPhone?: string;
      start: Date;
      end: Date;
      notes?: string;
    },
    channels: NotificationChannel[] = ['sms', 'email']
  ): Promise<{
    therapist: Record<NotificationChannel, { success: boolean; error?: string } | null>;
    patient: Record<NotificationChannel, { success: boolean; error?: string } | null>;
  }> {
    const results = {
      therapist: {} as Record<NotificationChannel, { success: boolean; error?: string } | null>,
      patient: {} as Record<NotificationChannel, { success: boolean; error?: string } | null>
    };

    // Initialize results with null for all channels
    channels.forEach(channel => {
      results.therapist[channel] = null;
      results.patient[channel] = null;
    });

    // Format session dates
    const startDate = new Date(session.start);
    const startTimeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeStr = new Date(session.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = startDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Create session notification data for therapist
    const therapistData: SessionNotificationData = {
      recipient: {
        name: session.therapistName,
        email: session.therapistEmail,
        phone: session.therapistPhone
      },
      sessionDetails: {
        sessionId: session._id,
        therapistName: session.therapistName,
        patientName: session.patientName,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        notes: session.notes
      }
    };

    // Create session notification data for patient
    const patientData: SessionNotificationData = {
      recipient: {
        name: session.patientName,
        email: session.patientEmail,
        phone: session.patientPhone
      },
      sessionDetails: {
        sessionId: session._id,
        therapistName: session.therapistName,
        patientName: session.patientName,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        notes: session.notes
      }
    };

    // Send notifications through all requested channels
    for (const channel of channels) {
      // Send to therapist if they have the required contact info
      if ((channel === 'email' && therapistData.recipient.email) || 
          (channel === 'sms' && therapistData.recipient.phone)) {
        results.therapist[channel] = await this.sendNotification(channel, therapistData);
      }
      
      // Send to patient if they have the required contact info
      if ((channel === 'email' && patientData.recipient.email) || 
          (channel === 'sms' && patientData.recipient.phone)) {
        results.patient[channel] = await this.sendNotification(channel, patientData);
      }
    }

    return results;
  }
}

// Export a singleton instance of the notification service
export const notificationService = new NotificationService(); 