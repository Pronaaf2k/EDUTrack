// /seeder/seed.js

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

console.log("Firebase Admin Initialized.");

// --- Data Definitions ---

const users = [
  {
    uid: "student-samiyeel-01",
    email: "samiyeel@edutrack.app",
    password: "password123",
    customId: "2212779042",
    role: "student",
    displayName: "Samiyeel Alim Binaaf",
    profile: {
      degree: "BS in CSE",
      curriculum: "BS in CSE - 130 Credit",
      avatarUrl: "https://rds3.northsouth.edu/assets/images/avatars/profile-pic.jpg",
      advisorId: "TNS1"
    }
  },
  {
    uid: "student-atique-02",
    email: "atique@edutrack.app",
    password: "password456",
    customId: "2132882642",
    role: "student",
    displayName: "Atique Shahrier Chaklader",
    profile: {
        degree: "BS in CS",
        curriculum: "BS in CS - 130 Credit",
        avatarUrl: "https://i.pravatar.cc/150?u=atique@edutrack.app",
        advisorId: "TNS1"
    }
  }
];

const faculty = [
    {
        advisorId: "TNS1",
        name: "Tanzilah Noor Shabnam",
        email: "tanzilah.shabnam@northsouth.edu",
        room: "SAC855",
        department: "ECE"
    }
];

const courses = {
    "CSE115": { title: 'Programming Language I', credits: 3, schedule: [{ day: 'Sunday', time: '09:40 AM - 11:10 AM', room: 'SAC304' }, { day: 'Tuesday', time: '09:40 AM - 11:10 AM', room: 'SAC304' }] },
    "CSE115L": { title: 'Programming Language I Lab', credits: 1, schedule: [{ day: 'Thursday', time: '09:40 AM - 11:10 AM', room: 'LIB602' }] },
    "CSE173": { title: 'Discrete Mathematics', credits: 3, schedule: [{ day: 'Monday', time: '11:20 AM - 12:50 PM', room: 'SAC308' }, { day: 'Wednesday', time: '11:20 AM - 12:50 PM', room: 'SAC308' }] },
    "CSE215": { title: 'Programming Language II', credits: 3, schedule: [{ day: 'Sunday', time: '02:00 PM - 03:30 PM', room: 'NAC211' }, { day: 'Tuesday', time: '02:00 PM - 03:30 PM', room: 'NAC211' }] },
    "CSE215L": { title: 'Programming Language II Lab', credits: 1, schedule: [{ day: 'Wednesday', time: '02:00 PM - 03:30 PM', room: 'LIB604' }] },
    "CSE225": { title: 'Data Structures & Algorithms', credits: 3, schedule: [{ day: 'Monday', time: '08:00 AM - 09:30 AM', room: 'SAC301' }, { day: 'Wednesday', time: '08:00 AM - 09:30 AM', room: 'SAC301' }] },
    "CSE225L": { title: 'Data Structures & Algorithms Lab', credits: 1, schedule: [{ day: 'Sunday', time: '08:00 AM - 09:30 AM', room: 'LIB601' }] },
    "CSE327": { title: 'Software Engineering', credits: 3, schedule: [{ day: 'Monday', time: '02:00 PM - 03:30 PM', room: 'NAC601' }] },
    "CSE331": { title: 'Microprocessor Interfacing', credits: 3, schedule: [{ day: 'Tuesday', time: '11:20 AM - 12:50 PM', room: 'SAC405' }] },
    "CSE373": { title: 'Design and Analysis of Algorithms', credits: 3, schedule: [{ day: 'Wednesday', time: '09:40 AM - 11:10 AM', room: 'NAC209' }] },
    "CSE411": { title: 'Advanced Database Management Systems', credits: 3, schedule: [{ day: 'Thursday', time: '03:40 PM - 05:10 PM', room: 'LIB608' }] },
};

const enrollments = {
    "student-samiyeel-01": [
        { courseId: "CSE115", semester: "Spring 2025", grade: "A", attendanceSummary: { present: 22, absent: 2, total: 24 } },
        { courseId: "CSE115L", semester: "Spring 2025", grade: "A", attendanceSummary: { present: 11, absent: 1, total: 12 } },
        { courseId: "CSE173", semester: "Spring 2025", grade: "A-", attendanceSummary: { present: 23, absent: 1, total: 24 } },
        { courseId: "CSE225", semester: "Summer 2025", grade: "B", attendanceSummary: { present: 20, absent: 4, total: 24 } },
        { courseId: "CSE225L", semester: "Summer 2025", grade: "A", attendanceSummary: { present: 12, absent: 0, total: 12 } },
        { courseId: "CSE215", semester: "Summer 2025", grade: "A-", attendanceSummary: { present: 21, absent: 3, total: 24 } },
        { courseId: "CSE327", semester: "Fall 2025", grade: "IP", attendanceSummary: { present: 4, absent: 0, total: 4 } }
    ],
    "student-atique-02": [
        { courseId: "CSE115", semester: "Spring 2025", grade: "B+", attendanceSummary: { present: 20, absent: 4, total: 24 } },
        { courseId: "CSE173", semester: "Spring 2025", grade: "A", attendanceSummary: { present: 24, absent: 0, total: 24 } },
        { courseId: "CSE373", semester: "Fall 2025", grade: "IP", attendanceSummary: { present: 3, absent: 1, total: 4 } }
    ]
};

const gradeDisputes = [
    {
        studentUid: "student-samiyeel-01",
        studentId: "2212779042",
        courseId: "CSE173",
        semester: "Spring 2025",
        currentGrade: "A-",
        expectedGrade: "A",
        reason: "I believe there was a miscalculation in my final exam score. I performed very well and would like the script to be re-evaluated.",
        status: "In Review",
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        facultyId: "TNS1",
        resolutionDetails: null,
        resolvedAt: null
    },
    {
        studentUid: "student-atique-02",
        studentId: "2132882642",
        courseId: "CSE115",
        semester: "Spring 2025",
        currentGrade: "B+",
        expectedGrade: "A-",
        reason: "My attendance was perfect and I completed all assignments. I believe my grade should be higher.",
        status: "Resolved",
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        facultyId: "TNS1",
        resolutionDetails: "After re-evaluation, the final grade remains B+.",
        resolvedAt: admin.firestore.FieldValue.serverTimestamp()
    }
];

const seedData = async () => {
  const batch = db.batch();

  console.log("Seeding Users...");
  for (const user of users) {
    try {
      await auth.getUserByEmail(user.email);
      console.log(`Auth user ${user.email} already exists. Updating Firestore data.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        try {
          await auth.createUser({
            uid: user.uid,
            email: user.email,
            password: user.password,
            displayName: user.displayName
          });
          console.log(`✅ Successfully created auth user: ${user.email}`);
        } catch (creationError) {
          console.error(`❌ Error creating auth user ${user.email}:`, creationError.message);
          continue;
        }
      } else {
        console.error(`Error checking for user ${user.email}:`, error.message);
        continue;
      }
    }
    const { password, ...firestoreUserData } = user;
    const userRef = db.collection("users").doc(user.uid);
    batch.set(userRef, firestoreUserData);
  }

  console.log("Seeding Faculty...");
  faculty.forEach(fac => {
      const facRef = db.collection("faculty").doc(fac.advisorId);
      batch.set(facRef, fac);
  });

  console.log("Seeding Courses...");
  Object.keys(courses).forEach(courseId => {
      const courseRef = db.collection("courses").doc(courseId);
      batch.set(courseRef, courses[courseId]);
  });

  console.log("Seeding Student Enrollments...");
  for (const studentUid in enrollments) {
      for (const enrollmentData of enrollments[studentUid]) {
          const enrollmentRef = db.collection("users").doc(studentUid).collection("enrollments").doc();
          batch.set(enrollmentRef, {
              courseId: enrollmentData.courseId,
              semester: enrollmentData.semester,
              grade: enrollmentData.grade,
              attendanceSummary: enrollmentData.attendanceSummary,
              courseDetails: courses[enrollmentData.courseId]
          });
      }
  }
  
  console.log("Seeding Grade Disputes...");
  gradeDisputes.forEach(dispute => {
      const disputeRef = db.collection("gradeDisputes").doc();
      batch.set(disputeRef, dispute);
  });

  try {
    await batch.commit();
    console.log("\n✅ Firestore data batch committed successfully!");
  } catch (error) {
    console.error("\n❌ Error committing batch to Firestore:", error);
  }
};

seedData().then(() => {
    console.log("Seeder script finished.");
    process.exit(0);
}).catch(e => {
    console.error("Seeder script failed:", e);
    process.exit(1);
});