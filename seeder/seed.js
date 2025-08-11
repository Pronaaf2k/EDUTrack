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
    "CSE115": { title: 'Programming Language I', credits: 3 },
    "CSE115L": { title: 'Programming Language I Lab', credits: 1 },
    "CSE173": { title: 'Discrete Mathematics', credits: 3 },
    "CSE215": { title: 'Programming Language II', credits: 3 },
    "CSE215L": { title: 'Programming Language II Lab', credits: 1 },
    "CSE225": { title: 'Data Structures & Algorithms', credits: 3 },
    "CSE225L": { title: 'Data Structures & Algorithms Lab', credits: 1 },
    "CSE231": { title: 'Digital Logic Design', credits: 3 },
    "CSE231L": { title: 'Digital Logic Design Lab', credits: 1 },
    "CSE299": { title: 'Junior Design Project', credits: 3 },
    "CSE311": { title: 'Database Systems', credits: 3 },
    "CSE311L": { title: 'Database Systems Lab', credits: 1 },
    "CSE327": { title: 'Software Engineering', credits: 3 },
    "PHY107": { title: 'Physics I', credits: 3 },
    "ENG102": { title: 'Introduction to Composition', credits: 3 },
    "MAT120": { title: 'Calculus I', credits: 3 },
};

const enrollments = [
    ["student-samiyeel-01", "CSE115", "Spring 2024", "A"],
    ["student-samiyeel-01", "CSE115L", "Spring 2024", "A"],
    ["student-samiyeel-01", "CSE225", "Spring 2025", "IP"],
    ["student-atique-02", "CSE115", "Spring 2024", "B+"],
];

const seedData = async () => {
  const batch = db.batch();

  console.log("Seeding Users...");
  for (const user of users) {
    let authUserExists = true;
    try {
      // Check if user already exists in Auth before trying to create
      await auth.getUserByEmail(user.email);
      console.log(`Auth user with email ${user.email} already exists. Skipping creation.`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        authUserExists = false; // User doesn't exist, so we can create them
      } else {
        console.error(`Error checking for user ${user.email}:`, error.message);
        continue; // Skip this user if there's another error
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
        continue; // If creation fails, skip adding them to Firestore
      }
    }
    
    // Only add to Firestore if the Auth user exists or was just created
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