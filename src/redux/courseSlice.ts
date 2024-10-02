import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';

// Define the Lesson interface
export interface Lesson {
  title: string;
  video: string | null; // Store only the file name
  displayVideo: string | null; // New field for displayVideo
  description: string;
}

// Define the Section interface
export interface Section {
  title: string;
  lessons: Lesson[];
}

// Define the CourseState interface
interface CourseState {
  addCourse: {
    courseName: string;
    courseDescription: string;
    coursePrice: number;
    courseDiscountPrice: number;
    courseCategory: string;
    courseLevel: string;
    demoURL: string;
    thumbnail: string;
    thumbnailUrl: string | null;
  };
  addCourse2: {
    prerequisites: string[];
    benefits: string[];
  };
  sections: Section[];
  courseDetails: {
    courseName: string;
    courseDescription: string;
    coursePrice: number;
    courseDiscountPrice: number;
    courseCategory: string;
    courseLevel: string;
    demoURL: string;
    thumbnail: string;
    thumbnailUrl: string | null;
    prerequisites: string[];
    benefits: string[];
    sections: Section[];
  };
}

// Define the initial state
const initialState: CourseState = {
  addCourse: {
    courseName: "",
    courseDescription: "",
    coursePrice: 0,
    courseDiscountPrice: 0,
    courseCategory: "",
    courseLevel: "",
    demoURL: "",
    thumbnail: "",
    thumbnailUrl: ""
  },
  addCourse2: {
    prerequisites: [],
    benefits: [],
  },
  sections: [],
  courseDetails: {
    courseName: "",
    courseDescription: "",
    coursePrice: 0,
    courseDiscountPrice: 0,
    courseCategory: "",
    courseLevel: "",
    demoURL: "",
    thumbnail: "",
    thumbnailUrl: "",
    prerequisites: [],
    benefits: [],
    sections: [],
  },
};

// Create the course slice
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    saveAddCourse(state, action: PayloadAction<CourseState["addCourse"]>) {
      state.addCourse = action.payload;
      state.courseDetails = {
        ...state.courseDetails,
        ...action.payload,
      };
    },
    saveAddCourse2(state, action: PayloadAction<CourseState["addCourse2"]>) {
      state.addCourse2 = action.payload;
      state.courseDetails = {
        ...state.courseDetails,
        ...action.payload,
      };
    },
    saveLessons(
      state,
      action: PayloadAction<{
        sectionIndex: number;
        lessonIndex: number;
        videoUrl: string;
        lessonTitle: string;
        sectionTitle: string;
        lessonDescription: string;
        displayVideo: string; // Include displayVideo
      }>
    ) {
      const { sectionIndex, lessonIndex, videoUrl, displayVideo, lessonTitle, sectionTitle, lessonDescription } = action.payload;

      // Ensure the sections array exists
      if (!state.sections) {
        state.sections = [];
      }

      // Ensure the section exists
      if (!state.sections[sectionIndex]) {
        // Create the section if it doesn't exist
        state.sections[sectionIndex] = {
          title: sectionTitle,
          lessons: [],
        };
      } else {
        // Always update the section title
        state.sections[sectionIndex].title = sectionTitle;
      }

      // Ensure the lessons array exists for the section
      if (!state.sections[sectionIndex].lessons) {
        state.sections[sectionIndex].lessons = [];
      }

      // Ensure the lesson exists in the section
      if (!state.sections[sectionIndex].lessons[lessonIndex]) {
        // Create the lesson if it doesn't exist
        state.sections[sectionIndex].lessons[lessonIndex] = {
          title: lessonTitle,
          video: null,
          displayVideo: null,
          description: lessonDescription,
        };
      }

      // Update the lesson with the new video URL, title, description, and displayVideo
      state.sections[sectionIndex].lessons[lessonIndex] = {
        ...state.sections[sectionIndex].lessons[lessonIndex],
        video: videoUrl,
        displayVideo: displayVideo, // Update displayVideo
        title: lessonTitle || state.sections[sectionIndex].lessons[lessonIndex].title,
        description: lessonDescription || state.sections[sectionIndex].lessons[lessonIndex].description,
      };
    },
    clearCourseData(state) {
      state.addCourse = initialState.addCourse;
      state.addCourse2 = initialState.addCourse2;
      state.sections = initialState.sections;
      state.courseDetails = initialState.courseDetails;
    },
  },
});

// Selectors
export const selectCourseDetails = (state: { course: CourseState }) => state.course.courseDetails;
export const selectSections = (state: { course: CourseState }) => state.course.sections;

// Memoized selector to get lessons
export const selectLessons = createSelector(
  [selectSections],
  (sections) => sections.flatMap(section => section.lessons)
);

// Export actions
export const { saveAddCourse, saveAddCourse2, saveLessons, clearCourseData } = courseSlice.actions;

// Export the reducer
export default courseSlice.reducer;
