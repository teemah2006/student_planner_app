export const examPeriods = [
  "First Term Exam",
  "Second Term Exam",
  "Third Term Exam",
  "Midterm Exam",
  "First Semester Exam",
  "Second Semester Exam",
  "Final Exam",
  "Continuous Assessment Test (CAT)",
  "Practice Test",
  "Other",
];

export const examTypes = {
  nigeria: {
    primary: [
      "Common Entrance Exam",
    ],
    secondary: [
      "Junior WAEC (BECE)",
      "WAEC (WASSCE)",
      "NECO",
      "JAMB UTME",
    ],
    tertiary: [
      "Post-UTME",
      "Final Year Project Defense",
    ],
  },

  "united states": {
    primary: [
      "State Standardized Test",
    ],
    secondary: [
      "SAT",
      "ACT",
      "AP Exams",
      "High School Final Exams",
    ],
    tertiary: [
      "GRE",
      "GMAT",
      "College Midterms",
      "College Finals",
    ],
  },

  "united kingdom": {
    primary: [
      "KS2 SATs",
    ],
    secondary: [
      "GCSEs",
      "A-Levels",
      "BTEC",
    ],
    tertiary: [
      "University Midterms",
      "University Finals",
    ],
  },

  canada: {
    primary: [
      "Provincial Achievement Tests",
    ],
    secondary: [
      "High School Diploma Exams",
      "AP Exams",
      "IB Exams",
    ],
    tertiary: [
      "College Midterms",
      "College Finals",
    ],
  },

  india: {
    primary: [
      "State Board Primary Exams",
    ],
    secondary: [
      "CBSE Board Exams",
      "ICSE Board Exams",
      "State Board Exams",
      "JEE (for Engineering)",
      "NEET (for Medicine)",
    ],
    tertiary: [
      "University Semester Exams",
      "Final Year Exams",
    ],
  },

  international: {
    secondary: [
      "IGCSE",
      "IB Diploma Exams",
    ],
    tertiary: [
      "TOEFL",
      "IELTS",
      "GRE",
      "GMAT",
    ],
  },

  medical: {
    international: [
      "USMLE",
      "PLAB",
      "AMC Exam",
      "MCCQE",
      "NEET-PG",
      "MRCP",
      "MRCS",
      "NCLEX",
      "IELTS/OET"
    ],
    countrySpecific: {
      nigeria: ["MDCN Licensing Exam"],
      india: ["NEET", "FMGE"],
      pakistan: ["PMDC Exam"],
      "united states": ["USMLE", "COMLEX"],
      "united kingdom": ["PLAB", "UKMLA"],
      canada: ["MCCQE I", "MCCQE II"],
      australia: ["AMC MCQ", "AMC Clinical"],
      germany: ["Staatsexamen"],
      "saudi arabia": ["Prometric Exam"],
      "united arab emirates": ["Prometric Exam"],
      "south africa": ["HPCSA Exam"]
    }
  }
};
