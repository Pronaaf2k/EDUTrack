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
    // ADDED: Link user to a curriculum
    curriculumId: "BScse130", 
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
    // ADDED: Link user to a curriculum
    curriculumId: "BScse130", 
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

// MODIFIED: Added a 'code' property to each course for consistency
const courses = {
    "CSE115": { code: "CSE115", title: 'Programming Language I', credits: 3 },
    "CSE115L": { code: "CSE115L", title: 'Programming Language I Lab', credits: 1 },
    "CSE173": { code: "CSE173", title: 'Discrete Mathematics', credits: 3 },
    "CSE215": { code: "CSE215", title: 'Programming Language II', credits: 3 },
    "CSE215L": { code: "CSE215L", title: 'Programming Language II Lab', credits: 1 },
    "CSE225": { code: "CSE225", title: 'Data Structures & Algorithms', credits: 3 },
    "CSE225L": { code: "CSE225L", title: 'Data Structures & Algorithms Lab', credits: 1 },
    "CSE231": { code: "CSE231", title: 'Digital Logic Design', credits: 3 },
    "CSE231L": { code: "CSE231L", title: 'Digital Logic Design Lab', credits: 1 },
    "CSE299": { code: "CSE299", title: 'Junior Design Project', credits: 3 },
    "CSE311": { code: "CSE311", title: 'Database Systems', credits: 3 },
    "CSE311L": { code: "CSE311L", title: 'Database Systems Lab', credits: 1 },
    "CSE327": { code: "CSE327", title: 'Software Engineering', credits: 3 },
    "PHY107": { code: "PHY107", title: 'Physics I', credits: 3 },
    "ENG102": { code: "ENG102", title: 'Introduction to Composition', credits: 3 },
    "MAT120": { code: "MAT120", title: 'Calculus I', credits: 3 },
};

// ADDED: New data for the curriculums collection
const curriculums = {
    "BScse130": {
        name: "Bachelor of Science in Computer Science and Engineering",
        totalCredits: 130,
        requiredCourses: [
            "CSE115", "CSE115L", "CSE173", "CSE215", "CSE215L", "CSE225", 
            "CSE225L", "CSE231", "CSE231L", "CSE299", "CSE311", "CSE311L", 
            "CSE327", "PHY107", "ENG102", "MAT120"
        ]
    }
};

const enrollments = [
    // Samiyeel has completed two courses and one is in progress
    ["student-samiyeel-01", "CSE115", "Spring 2024", "A"],
    ["student-samiyeel-01", "CSE115L", "Spring 2024", "A"],
    ["student-samiyeel-01", "CSE225", "Spring 2025", "IP"],
    // Atique has only completed one course
    ["student-atique-02", "CSE115", "Spring 2024", "B+"],
];

const seedData = async () => {
  const batch = db.batch();

  console.log("Seeding Users...");
  for (const user of users) {
    let authUserExists = true;
    try {
      await auth.getUserByEmail(user.email);
      console.log(`Auth user with email ${user.email} already exists. Skipping creation.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        authUserExists = false;
      } else {
        console.error(`Error checking for user ${user.email}:`, error.message);
        continue;
      }
    }

    if (!authUserExists) {
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
  
  // ADDED: Seeding logic for the new curriculums collection
  console.log("Seeding Curriculums...");
  Object.keys(curriculums).forEach(curriculumId => {
      const curriculumRef = db.collection("curriculums").doc(curriculumId);
      batch.set(curriculumRef, curriculums[curriculumId]);
  });
  
  console.log("Seeding Student Enrollments...");
  for (const [studentUid, courseId, semester, grade] of enrollments) {
      const enrollmentRef = db.collection("users").doc(studentUid).collection("enrollments").doc();
      batch.set(enrollmentRef, {
          courseId: courseId,
          semester: semester,
          grade: grade,
          courseDetails: courses[courseId]
      });
  }

  try {
    await batch.commit();
    console.log("\n✅ Firestore data batch committed successfully!");
  } catch (error) {
    console.error("\n❌ Error committing batch to Firestore:", error);
  }
};

seedData().then(() => {
    console.log("Seeder script finished.");
}).catch(e => {
    console.error("Seeder script failed:", e);
});