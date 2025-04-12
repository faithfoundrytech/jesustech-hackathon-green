/**
 * Represents a notification recipient
 */
export interface NotificationRecipient {
  name: string;
  email?: string;
  phone?: string;
}

/**
 * Represents the types of notification channels available
 */
export type NotificationChannel = 'sms' | 'email' | 'whatsapp';

/**
 * Base notification data that all notification types will extend
 */
export interface BaseNotificationData {
  recipient: NotificationRecipient;
  template?: string;
}

/**
 * Session notification data structure
 */
export interface SessionNotificationData extends BaseNotificationData {
  sessionDetails: {
    sessionId: string;
    therapistName: string;
    patientName: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  };
}

/**
 * Interface for notification providers (SMS, Email, WhatsApp)
 */
export interface NotificationProvider {
  /**
   * Send a notification via this provider
   * @param data The notification data to send
   * @returns A promise indicating success or failure
   */
  send(data: BaseNotificationData): Promise<{ success: boolean; error?: string }>;
  
  /**
   * Check if this provider is available/configured
   */
  isAvailable(): boolean;
} 