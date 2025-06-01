import { NextResponse } from 'next/server';
import { adminDb } from '../../../../utils/firebaseAdmin';
import { utcToZonedTime } from 'date-fns-tz';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('studyPlans').get();
    const timeZone = 'Africa/Lagos';
    const now = utcToZonedTime(new Date(), timeZone);

    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();
      const uid = docSnap.id;

      const createdAt = userData.createdAt?.toDate?.() || new Date();
      const diffInMs = now.getTime() - createdAt.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const day = diffInDays + 1;

      let currentDay = '';
      if (day > 7) {
        currentDay = `Day ${day % 7 === 0 ? 7 : day % 7}`;
      } else {
        currentDay = `Day ${day}`;
      }

      const todayPlan = userData.plan.find(
        (dayObj: { day: string; sessions: [] }) => dayObj.day === currentDay
      );

      if (!todayPlan) continue;

      // 🔁 Fallback to get email from recommendation if not in studyPlan
      let userEmail = userData.email;
      if (!userEmail) {
        const recSnap = await adminDb
          .collection('users')
          .doc(uid)
          .collection('recommendations')
          .limit(1)
          .get();
        if (!recSnap.empty) {
          const firstRec = recSnap.docs[0].data();
          userEmail = firstRec.email || null;
        }
      }

      if (!userEmail) continue; // If no email found, skip

      for (const session of todayPlan.sessions) {
        const startTime = session.timeInterval.split(' - ')[0].trim(); // e.g. "6:00pm"
        const [hour, minute] = convertTo24Hr(startTime);

        const sessionDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
          minute
        );

        const diffMinutes = (sessionDate.getTime() - now.getTime()) / (1000 * 60);

        if (diffMinutes > 25 && diffMinutes < 35) {
          await sendEmail(userEmail, session.subject, session.timeInterval);
        }
      }
    }

    return NextResponse.json({ message: 'Reminder check completed.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error sending reminders.' }, { status: 500 });
  }
}

// Converts "6:00pm" to [18, 0]
function convertTo24Hr(timeStr: string): [number, number] {
  const [time, modifier] = timeStr.split(/(am|pm)/);
  const [rawHours, minutes] = time.split(':').map(Number);
  let hours = rawHours;

  if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

  return [hours, minutes];
}

async function sendEmail(to: string, subject: string, time: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(`📨 Sending email to ${to} for session at ${time}`);

  await transporter.sendMail({
    from: `"Study Buddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: '⏰ Study Session Reminder!',
    text: `Hey there! 🧠

Your study session for "${subject}" is coming up at ${time}.

You got this! Keep pushing! 🚀

- Your Study Buddy from StudyEase`,
  });

  console.log('✅ Email sent');
}
