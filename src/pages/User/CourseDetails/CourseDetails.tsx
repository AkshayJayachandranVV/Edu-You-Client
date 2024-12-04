import React from 'react';
import PurchasedSingleCourse from '../CoursePurchased/CoursePurchased';
import CourseView from '../../../components/User/UserCourseDetails/UserCourseDetails';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const coursesEnrolled = useSelector((state: RootState) => state.user.coursesEnrolled);

  if (!courseId) {
    return <div>Course ID is missing. Please check the URL.</div>;
  }

  // Check if courseId is in coursesEnrolled
  const isEnrolled = coursesEnrolled?.includes(courseId);

  return (
    <div>
      {isEnrolled ? (
        <PurchasedSingleCourse courseId={courseId} />
      ) : (
        <CourseView courseId={courseId} />
      )}
    </div>
  );
};

export default CourseDetails;
