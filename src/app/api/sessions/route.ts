import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/session";
import Patient from "@/models/patient";
import Therapist from "@/models/therapist";
import { Types } from "mongoose";
import { notificationService } from "@/services/notifications/notification-service";
import { NotificationChannel } from "@/services/notifications/types";

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const { 
      patientId, 
      therapistId, 
      start, 
      end, 
      status = 'scheduled', 
      notes, 
      notificationChannels = ['sms', 'email'] 
    } = data;

    // Validate required fields
    if (!patientId || !therapistId || !start || !end) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate notification channels if provided
    if (notificationChannels && !Array.isArray(notificationChannels)) {
      return NextResponse.json(
        { error: "notificationChannels must be an array" },
        { status: 400 }
      );
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Check if therapist exists
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    // Create new session
    const session = await Session.create({
      patient: patientId,
      therapist: therapistId,
      start,
      end,
      status,
      patientName: patient.name,
      therapistName: therapist.name,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Send notifications if channels are specified
    if (notificationChannels && notificationChannels.length > 0) {
      try {
        const notificationResult = await notificationService.sendSessionNotifications(
          {
            _id: session._id.toString(),
            patientId: patient._id.toString(),
            patientName: patient.name,
            patientEmail: patient.email,
            patientPhone: patient.phone,
            therapistId: therapist._id.toString(),
            therapistName: therapist.name,
            therapistEmail: therapist.email,
            therapistPhone: therapist.phone,
            start: new Date(start),
            end: new Date(end),
            notes
          },
          notificationChannels as NotificationChannel[]
        );
        
        console.log('Notification results:', JSON.stringify(notificationResult, null, 2));
      } catch (notificationError) {
        // Log error but don't fail the session creation
        console.error('Failed to send session notifications:', notificationError);
      }
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get('therapistId');
    const patientId = searchParams.get('patientId');

    console.log('API Request - therapistId:', therapistId, 'patientId:', patientId);

    if (!therapistId && !patientId) {
      return NextResponse.json(
        { error: "Either therapistId or patientId is required" },
        { status: 400 }
      );
    }

    let query = {};
    if (therapistId) {
      query = { therapist: new Types.ObjectId(therapistId) };
    } else if (patientId) {
      query = { patient: new Types.ObjectId(patientId) };
    }

    console.log('MongoDB Query:', query);

    const sessions = await Session.find(query)
      .sort({ start: 1 })
      .populate('patient', 'name')
      .populate('therapist', 'name');


    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
} 