import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import { editAddCourse2 } from "../../../redux/editCourseSlice";

interface Prerequisite {
  value: string;
}

interface Benefit {
  value: string;
}

interface CourseFormValues {
  prerequisites: Prerequisite[];
  benefits: Benefit[];
}

interface AddCoursePage2Props {
  onNext: () => void;
  onBack: () => void;
}

const EditCoursePage2: React.FC<AddCoursePage2Props> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();

  // Get course data from Redux state
  const courseData = useSelector((state: any) => state.editCourse.courseDetails); // Adjust according to your Redux state structure

  console.log(courseData,"0000000000000000000000000000000gotcha")



  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<CourseFormValues>({
    defaultValues: {
      prerequisites: [{ value: "" }],
      benefits: [{ value: "" }],
    }
  });

  const {
    fields: prerequisitesFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    control,
    name: 'prerequisites',
  });

  const {
    fields: benefitsFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: 'benefits',
  });

  useEffect(() => {
  // Set form values from Redux state when the component mounts or courseData changes
  if (courseData) {
    // Clear existing fields before populating
    setValue('prerequisites', []); // Clear current fields
    setValue('benefits', []); // Clear current fields

    // Populate prerequisites
    if (courseData.prerequisites && courseData.prerequisites.length) {
      courseData.prerequisites.forEach((prerequisite: string) => {
        appendPrerequisite({ value: prerequisite });
      });
    }

    // Populate benefits
    if (courseData.benefits && courseData.benefits.length) {
      courseData.benefits.forEach((benefit: string) => {
        appendBenefit({ value: benefit });
      });
    }
  }
}, [courseData, appendPrerequisite, appendBenefit, setValue]);


  const onSubmit = (data: CourseFormValues) => {
    console.log("Data from Step 2:", data);

    // Extract string values from the Prerequisite objects if needed
    const prerequisites = data.prerequisites.map((prerequisite) => prerequisite.value); // Adjust based on your Prerequisite structure
    const benefits = data.benefits.map((benefit) => benefit.value); // Adjust based on your Benefit structure

    console.log(prerequisites, benefits, "this is the prerequisites and benefits from submit");

    dispatch(
      editAddCourse2({
        prerequisites: prerequisites, // Now this is a string array
        benefits: benefits, // Ensure this is also a string array
      })
    );

    onNext(); // Move to the next step
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#0a0c11' }}>
      <div className="w-[90%] max-w-4xl bg-[#1b2532] shadow-lg rounded-lg px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">Add Course Details</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-gray-300">Prerequisites</h3>
              {prerequisitesFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`prerequisites.${index}.value`, { required: "Prerequisite is required" })}
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.prerequisites?.[index]?.value ? 'border-red-600' : 'border-gray-600'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter a prerequisite..."
                  />
                  <button
                    type="button"
                    className="p-2 text-red-600 hover:text-red-800"
                    onClick={() => removePrerequisite(index)}
                  >
                    <FaTrash />
                  </button>
                  {errors.prerequisites?.[index]?.value && (
                    <span className="text-red-500">{errors.prerequisites[index].value.message}</span>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-[#5f71ea] text-white font-semibold rounded-md hover:bg-[#4e5eb4] transition"
                onClick={() => appendPrerequisite({ value: "" })}
              >
                <FaPlus className="mr-2" /> Add Prerequisite
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-gray-300">Benefits</h3>
              {benefitsFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`benefits.${index}.value`, { required: "Benefit is required" })}
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.benefits?.[index]?.value ? 'border-red-600' : 'border-gray-600'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter a benefit..."
                  />
                  <button
                    type="button"
                    className="p-2 text-red-600 hover:text-red-800"
                    onClick={() => removeBenefit(index)}
                  >
                    <FaTrash />
                  </button>
                  {errors.benefits?.[index]?.value && (
                    <span className="text-red-500">{errors.benefits[index].value.message}</span>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 bg-[#5f71ea] text-white font-semibold rounded-md hover:bg-[#4e5eb4] transition"
                onClick={() => appendBenefit({ value: "" })}
              >
                <FaPlus className="mr-2" /> Add Benefit
              </button>
            </div>

            <div className="w-full flex justify-between mt-6">
              <button
                type="button"
                className="py-2 px-8 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#0a0c11] transition"
                onClick={onBack} // Use the onBack prop
              >
                Back
              </button>
              <button
                type="submit"
                className="py-2 px-8 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#0a0c11] transition"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage2;
