import { BaseNotificationData, NotificationProvider, SessionNotificationData } from '../types';

/**
 * AfricasTalking SMS provider implementation
 * 
 * Note: This is a placeholder implementation. You'll need to:
 * 1. Install the AfricasTalking SDK: npm install africastalking
 * 2. Set up environment variables for AFRICAS_TALKING_API_KEY, AFRICAS_TALKING_USERNAME, and AFRICAS_TALKING_SENDER_ID
 */
export class AfricasTalkingSmsProvider implements NotificationProvider {
  private apiKey: string | undefined;
  private username: string | undefined;
  private senderId: string | undefined;
  private client: any;

  constructor() {
    this.apiKey = process.env.AFRICAS_TALKING_API_KEY;
    this.username = process.env.AFRICAS_TALKING_USERNAME;
    this.senderId = process.env.AFRICAS_TALKING_SENDER_ID;
    
    // Initialize AfricasTalking client if credentials are available
    if (this.isAvailable()) {
      // Initialize the AfricasTalking client
      const AfricasTalking = require('africastalking')({
        apiKey: this.apiKey,
        username: this.username
      });
      this.client = AfricasTalking.SMS;
    }
  }

  /**
   * Check if the AfricasTalking provider is configured and available
   */
  isAvailable(): boolean {
    return !!(this.apiKey && this.username);
  }

  /**
   * Send an SMS notification via AfricasTalking
   */
  async send(data: BaseNotificationData): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if provider is available
      if (!this.isAvailable()) {
        return {
          success: false,
          error: 'AfricasTalking credentials not configured'
        };
      }

      // Check if recipient has a phone number
      if (!data.recipient.phone) {
        return {
          success: false,
          error: 'Recipient phone number is required for SMS notifications'
        };
      }

      // Format the phone number to ensure it's in the correct format for AfricasTalking
      const formattedPhone = this.formatPhoneNumber(data.recipient.phone);
      if (!formattedPhone) {
        return {
          success: false,
          error: `Invalid phone number format: ${data.recipient.phone}`
        };
      }

      // Generate message content based on data type
      const messageContent = this.generateMessageContent(data);

      // Log message for debugging
      console.log(`[AFRICAS_TALKING SMS] To: ${formattedPhone}, Message: ${messageContent}`);

      // Send the SMS message via AfricasTalking API
      if (this.client) {
        const options = {
          to: [formattedPhone],
          message: messageContent,
          from: this.senderId // Optional sender ID
        };
        
        const response = await this.client.send(options);
        console.log('SMS sent with response:', response);
        
        // Check if the message was sent successfully
        if (response && response.SMSMessageData && 
            response.SMSMessageData.Recipients && 
            response.SMSMessageData.Recipients.length > 0) {
          const recipient = response.SMSMessageData.Recipients[0];
          if (recipient.status === 'Success') {
            return { success: true };
          } else {
            return { 
              success: false, 
              error: `Failed to send SMS: ${recipient.status}` 
            };
          }
        }
        
        // Default return if we don't get a valid response structure
        return { 
          success: false, 
          error: 'Invalid response from AfricasTalking API' 
        };
      } else {
        return {
          success: false,
          error: 'AfricasTalking client not initialized'
        };
      }
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending SMS'
      };
    }
  }

  /**
   * Format a phone number to ensure it's in the international format
   * required by AfricasTalking (e.g., +254...)
   */
  private formatPhoneNumber(phone: string): string | null {
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if we have a valid number of digits (at least 9)
    if (digitsOnly.length < 9) {
      return null;
    }
    
    // If the number starts with '0', replace it with the country code 
    // (assuming Kenyan number format)
    if (phone.startsWith('0')) {
      return `+254${digitsOnly.substring(1)}`;
    }
    
    // If the number starts with country code without +, add the +
    if (digitsOnly.startsWith('254')) {
      return `+${digitsOnly}`;
    }
    
    // If the number already has a +, just remove any other non-digit characters
    if (phone.startsWith('+')) {
      return `+${digitsOnly}`;
    }
    
    // Otherwise assume it's a Kenyan number without country code
    // and the leading 0 is missing
    if (digitsOnly.length <= 10) {
      return `+254${digitsOnly.startsWith('7') || digitsOnly.startsWith('1') ? digitsOnly : digitsOnly.substring(1)}`;
    }
    
    // Return with + prefix if not already present
    return digitsOnly.startsWith('+') ? digitsOnly : `+${digitsOnly}`;
  }

  /**
   * Generate message content based on notification data type
   */
  private generateMessageContent(data: BaseNotificationData): string {
    // Handle session notifications
    if (this.isSessionNotification(data)) {
      const sessionData = data as SessionNotificationData;
      const { sessionDetails } = sessionData;
      
      return `Hello ${data.recipient.name}, 
Your therapy session with ${sessionDetails.therapistName === data.recipient.name 
  ? sessionDetails.patientName 
  : sessionDetails.therapistName} is scheduled for ${sessionDetails.date} 
at ${sessionDetails.startTime}. ${sessionDetails.notes ? `Notes: ${sessionDetails.notes}` : ''}`;
    }
    
    // Default message for unknown notification types
    return `Hello ${data.recipient.name}, you have a new notification from Harmony.`;
  }

  /**
   * Type guard to check if notification data is a session notification
   */
  private isSessionNotification(data: BaseNotificationData): boolean {
    return 'sessionDetails' in data;
  }
} 