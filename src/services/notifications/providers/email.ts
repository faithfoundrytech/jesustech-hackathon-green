import { BaseNotificationData, NotificationProvider, SessionNotificationData } from '../types';

/**
 * Email provider implementation using Nodemailer with Gmail SMTP
 * 
 * Note: This implementation requires:
 * 1. Install Nodemailer: npm install nodemailer
 * 2. Set up environment variables for EMAIL_FROM, EMAIL_PASSWORD
 */
export class EmailProvider implements NotificationProvider {
  private emailPassword: string | undefined;
  private fromEmail: string | undefined;
  private transporter: any;

  constructor() {
    this.emailPassword = process.env.EMAIL_PASSWORD;
    this.fromEmail = process.env.EMAIL_FROM;
    
    // Initialize Nodemailer with Gmail SMTP if credentials are available
    if (this.emailPassword && this.fromEmail) {
      try {
        const nodemailer = require('nodemailer');
        
        // Create transport with Gmail
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: this.fromEmail,
            pass: this.emailPassword
          }
        });
        console.log('Email provider initialized successfully with Gmail SMTP');
      } catch (error) {
        console.error('Failed to initialize email provider:', error);
      }
    } else {
      console.warn('Email provider missing configuration. Check EMAIL_FROM and EMAIL_PASSWORD env variables.');
    }
  }

  /**
   * Check if the email provider is configured and available
   */
  isAvailable(): boolean {
    return !!(this.emailPassword && this.fromEmail && this.transporter);
  }

  /**
   * Send an email notification
   */
  async send(data: BaseNotificationData): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if provider is available
      if (!this.isAvailable()) {
        console.error('[EMAIL] Provider not available:', { 
          emailPassword: !!this.emailPassword, 
          fromEmail: !!this.fromEmail, 
          transporter: !!this.transporter 
        });
        return {
          success: false,
          error: 'Email provider not configured or missing dependencies'
        };
      }

      // Check if recipient has an email address
      if (!data.recipient.email) {
        console.error('[EMAIL] Missing recipient email address');
        return {
          success: false,
          error: 'Recipient email address is required for email notifications'
        };
      }

      // Generate email content based on data type
      const { subject, html } = this.generateEmailContent(data);

      // Log email for debugging
      console.log(`[EMAIL] Attempting to send email to: ${data.recipient.email}, Subject: ${subject}`);

      // Send the email via Nodemailer
      const mailOptions = {
        from: this.fromEmail,
        to: data.recipient.email,
        subject,
        html
      };
      
      console.log('[EMAIL] Mail options:', JSON.stringify({...mailOptions, from: '[REDACTED]'}, null, 2));
      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EMAIL] Email sent with response:', JSON.stringify(info, null, 2));
      
      return { success: true };
    } catch (error) {
      console.error('[EMAIL] Failed to send email notification:', error);
      const errorDetails = error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : { error };
      console.error('[EMAIL] Error details:', JSON.stringify(errorDetails, null, 2));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending email'
      };
    }
  }

  /**
   * Generate email content based on notification data type
   */
  private generateEmailContent(data: BaseNotificationData): { subject: string; html: string } {
    // Handle session notifications
    if (this.isSessionNotification(data)) {
      const sessionData = data as SessionNotificationData;
      const { sessionDetails } = sessionData;
      
      const otherParty = sessionDetails.therapistName === data.recipient.name 
        ? sessionDetails.patientName 
        : sessionDetails.therapistName;
      
      return {
        subject: `Therapy Session Scheduled on ${sessionDetails.date}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #3a6ea5;">Session Confirmation</h2>
            <p>Hello ${data.recipient.name},</p>
            <p>Your therapy session with <strong>${otherParty}</strong> has been scheduled for:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Date:</strong> ${sessionDetails.date}</p>
              <p><strong>Time:</strong> ${sessionDetails.startTime} - ${sessionDetails.endTime}</p>
              ${sessionDetails.notes ? `<p><strong>Notes:</strong> ${sessionDetails.notes}</p>` : ''}
            </div>
            <p>Please make sure to be available at the scheduled time.</p>
            <p>If you need to reschedule or cancel your session, please contact us as soon as possible.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 12px; color: #777;">This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        `
      };
    }
    
    // Default email for unknown notification types
    return {
      subject: 'Notification from Harmony',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello ${data.recipient.name},</h2>
          <p>You have a new notification from Harmony.</p>
        </div>
      `
    };
  }

  /**
   * Type guard to check if notification data is a session notification
   */
  private isSessionNotification(data: BaseNotificationData): boolean {
    return 'sessionDetails' in data;
  }
} 