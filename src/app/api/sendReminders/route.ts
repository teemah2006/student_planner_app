import { NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // 1. Get all study plans
    const querySnapshot = await getDocs(collection(db, 'studyPlans'));
    const now = new Date();

    for (const docSnap of querySnapshot.docs) {
      const userData = docSnap.data();
      const userEmail = docSnap.id; // because you used email as doc id
      const createdAt = userData.createdAt.toDate()

      // ?.seconds
      //   ? new Date(userData.createdAt.seconds * 1000)
      //   : new Date(userData.createdAt);
      // console.log(createdAt)

      // 2. Calculate today
      const diffInMs = now.getTime() - createdAt.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const currentDay = `Day ${diffInDays + 1}`;

      // 3. Find today's plan
      const todayPlan = userData.plan.find((dayObj: { day: string, sessions: [] }) => dayObj.day === currentDay);

      if (!todayPlan) continue;

      // 4. Check each session if it's about to start within 30 min
      for (const session of todayPlan.sessions) {
        const startTime = session.timeInterval.split(' - ')[0].trim(); // "6:00pm"
        const sessionDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          ...convertTo24Hr(startTime)
        );

        const diffMinutes = (sessionDate.getTime() - now.getTime()) / (1000 * 60);

        if (diffMinutes > 25 && diffMinutes < 35) {
          // If session is between 25-35 minutes away
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

// Convert "6:00pm" to [18, 0]
function convertTo24Hr(timeStr: string): [number, number] {
  const [time, modifier] = timeStr.split(/(am|pm)/);
  const [rawHours, minutes] = time.split(':').map(Number);
  let hours = rawHours;

  if (modifier.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  }
  if (modifier.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

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



  console.log(`Sending email to ${to} for session at ${time}`);

  await transporter.sendMail({
    from: `"Study Buddy" <${process.env.EMAIL_USER}>`,
    to,
    subject: '⏰ Study Session Reminder!',
    text: `Hey there! 🧠
  
  Your study session for "${subject}" is coming up at ${time}.
  
  You got this! Keep pushing! 🚀
  
  - Your Study Buddy`,
  });
  console.log('Email sent');
}
