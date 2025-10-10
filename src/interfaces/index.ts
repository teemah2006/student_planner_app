interface curriculumTopic {
  title: string;
  description: string;
  objectives: string[];
}

export interface curriculumProps {
  country: string;
  subject: string;
  level: string;
  topics: curriculumTopic[];
}

export interface subjectsProps {
    subject: string; 
    topics: { topic: string, level: string }[];
}

export interface StudyPlanProps {
  dailyPlan: {
    day: string,
    sessions:
    {
      subject: string,
      topic: string,
      level: string,
      activity: string,
      timeInterval: string;
    }[]
  }[];
}