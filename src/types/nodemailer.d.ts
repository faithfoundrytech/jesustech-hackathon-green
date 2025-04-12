declare module 'nodemailer' {
  export interface TransportOptions {
    service: string;
    auth: {
      user: string;
      pass: string;
    };
  }

  export interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<any>;
  }

  export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
  }

  export default {
    createTransport(options: TransportOptions): Transporter;
  };
} 