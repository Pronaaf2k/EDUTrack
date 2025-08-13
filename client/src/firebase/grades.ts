// client/src/firebase/grades.ts
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';

interface GradeRecord {
  code: string;
  title: string;
  credits: number;
  grade: string;
}

export interface SemesterData {
  semester: string;
  gpa: string;
  courses: GradeRecord[];
}

interface Enrollment {
  courseId: string;
  semester: string;
  grade: string;
  courseDetails: {
    title: string;
    credits: number;
  };
}

export interface CourseGradesData {
    semesters: SemesterData[];
    cgpa: string;
}

const calculateGPA = (courses: GradeRecord[]): string => {
    const gradePoints: { [key: string]: number } = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        if (gradePoints[course.grade] !== undefined) {
            totalPoints += gradePoints[course.grade] * course.credits;
            totalCredits += course.credits;
        }
    });

    if (totalCredits === 0) return 'N/A';
    return (totalPoints / totalCredits).toFixed(2);
};

export const getCourseGradesData = async (userUid: string): Promise<CourseGradesData> => {
    try {
        const enrollmentsRef = collection(db, "users", userUid, "enrollments");
        const enrollmentsQuery = query(enrollmentsRef, orderBy("semester", "desc"));
        const enrollmentsSnap = await getDocs(enrollmentsQuery);

        if (enrollmentsSnap.empty) {
            return { semesters: [], cgpa: 'N/A' };
        }

        const allEnrolledCourses: Enrollment[] = enrollmentsSnap.docs.map(d => d.data() as Enrollment);

        const semesterMap: { [key: string]: GradeRecord[] } = {};
        allEnrolledCourses.forEach(c => {
            if (!semesterMap[c.semester]) {
                semesterMap[c.semester] = [];
            }
            semesterMap[c.semester].push({
                code: c.courseId,
                title: c.courseDetails.title,
                credits: c.courseDetails.credits,
                grade: c.grade,
            });
        });

        const structuredSemesters: SemesterData[] = Object.entries(semesterMap).map(([semester, courses]) => ({
            semester,
            courses,
            gpa: calculateGPA(courses),
        })).sort((a, b) => b.semester.localeCompare(a.semester));

        const allGradedCourses = allEnrolledCourses
            .filter(c => c.grade !== 'IP')
            .map(c => ({
                code: c.courseId,
                title: c.courseDetails.title,
                credits: c.courseDetails.credits,
                grade: c.grade
            }));

        const cgpa = calculateGPA(allGradedCourses);

        return { semesters: structuredSemesters, cgpa };

    } catch (error) {
        console.error("Error fetching course grades data:", error);
        throw new Error("Failed to fetch course grades.");
    }
};