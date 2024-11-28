import React, { useRef, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { selectSections, editLessons, removeSectionFromRedux, removeLessonFromRedux } from "../../../redux/editCourseSlice";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Typography from "@mui/joy/Typography";
import LinearProgress from "@mui/joy/LinearProgress";
import { useCountUp } from "use-count-up";
import * as Yup from "yup";
import axios from "axios";
import { tutorEndpoints } from "../../constraints/endpoints/TutorEndpoints";
import { toast } from "sonner";

interface Lesson {
  title: string;
  video: string | null; // Adjust to match Redux type (string for URL, not File)
  displayVideo?: string | null;
  description: string;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

const validationSchema = Yup.object().shape({
  sections: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Section title is required"),
        lessons: Yup.array()
          .of(
            Yup.object().shape({
              title: Yup.string().required("Lesson title is required"),
              video: Yup.mixed().required("Video is required"),
              description: Yup.string().required("Description is required"),
            })
          )
          .min(1, "At least one lesson is required"),
      })
    )
    .min(1, "At least one section is required"),
});

interface AddLessonProps {
  onNext: (data: Section[]) => void;
  onBack: () => void;
}

const EditLesson: React.FC<AddLessonProps> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<boolean>(false);
  const [duration] = React.useState<number>(30);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});

  const handleFileChange =
    (
      sectionIndex: number,
      lessonIndex: number,
      setFieldValue: (field: string, value: string | null) => void // Handle as URL or string, not File
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0] ?? null;
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrls((prevUrls) => ({
          ...prevUrls,
          [`${sectionIndex}-${lessonIndex}`]: url,
        }));
        setSelectedFiles((prevFiles) => ({
          ...prevFiles,
          [`${sectionIndex}-${lessonIndex}`]: file,
        }));
        setFieldValue(
          `sections.${sectionIndex}.lessons.${lessonIndex}.video`,
          url // Store as preview URL for now, replace with S3 URL after upload
        );
      }
    };

  const generateFileName = (originalName: string) => {
    const extension = originalName.split(".").pop();
    return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
  };

  const handleS3Upload = async (
    sectionIndex: number,
    lessonIndex: number,
    lessonTitle: string,
    sectionTitle: string,
    lessonDescription: string
  ): Promise<void> => {
    setOpen(true);
    setCount(true);

    // Validate lesson details
    if (
      !sectionTitle.trim() ||
      !lessonTitle.trim() ||
      !lessonDescription.trim()
    ) {
      setOpen(false);
      setCount(false);
      toast.error("Please fill in all lesson details before uploading.");
      return;
    }

    const fileKey = `${sectionIndex}-${lessonIndex}`;
    const file = selectedFiles[fileKey];
    if (!file) {
      setOpen(false);
      setCount(false);
      toast.error("No video selected to upload.");
      return;
    }

    try {
      const fileName = generateFileName(file.name);
      const response = await axios.get(
        tutorEndpoints.getPresignedUrlForUpload,
        {
          params: {
            filename: fileName,
            fileType: "video",
          },
        }
      );

      const { uploadUrl, viewUrl, key } = response.data;

      // Upload the video to S3 using the presigned URL
      const result = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (result.status === 200) {
        // Dispatch Redux action to save the lesson details with the S3 key
        dispatch(
          editLessons({
            sectionIndex,
            lessonIndex,
            videoUrl: key, // Store the S3 key
            displayVideo: viewUrl,
            lessonTitle,
            sectionTitle,
            lessonDescription,
          })
        );
        toast.success("Upload successful! Video stored successfully.");
      } else {
        setOpen(false);
        setCount(false);
        toast.error("Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video.");
    } finally {
      setOpen(false); // Ensure the loader is closed regardless of success or error
      setCount(false);
    }
  };

  const { value } = useCountUp({
    isCounting: count,
    duration: duration,
    easing: "linear",
    start: 0,
    end: 100,
    onComplete: () => {
      setOpen(false); // Set open to false when counting completes
      setCount(false);
    },
  });

  const handleSubmit = async (values: { sections: Section[] }) => {
    onNext(values.sections);
  };

  const courseData = useSelector(selectSections); // Stored data from Redux

  console.log(courseData, "---------------------------------");
  // console.log(courseData.sections,"---------------------------------")



  const handleRemoveSection = (sectionIndex: number, removeSection: (index: number) => void) => {
    dispatch(removeSectionFromRedux(sectionIndex));
    removeSection(sectionIndex); // Remove from Formik local state
  };

  const handleRemoveLesson = (sectionIndex: number, lessonIndex: number, removeLesson: (index: number) => void) => {
    dispatch(removeLessonFromRedux({ sectionIndex, lessonIndex }));
    removeLesson(lessonIndex); // Remove from Formik local state
  };


 

  return (
    <div className="p-8 bg-gradient-to-br from-black to-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">Add Lessons</h2>
      <Formik
        initialValues={{
          sections:
            courseData.length > 0
              ? courseData
              : [
                  {
                    title: "",
                    lessons: [{ title: "", video: null, description: "" }],
                  },
                ],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <FieldArray name="sections">
              {({ remove: removeSection, push: pushSection }) => (
                <div className="space-y-8">
                  {values.sections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700"
                    >
                      <div className="flex flex-col mb-6">
                        <label
                          className="text-gray-300 font-medium mb-2"
                          htmlFor={`sections.${sectionIndex}.title`}
                        >
                          Section Title
                        </label>
                        <Field
                          name={`sections.${sectionIndex}.title`}
                          placeholder="Enter section title"
                          className="border border-gray-600 p-2 rounded-md bg-gray-900 text-white focus:border-blue-500"
                        />
                        <ErrorMessage
                          name={`sections.${sectionIndex}.title`}
                          component="div"
                          className="text-red-500 mt-1"
                        />
                      </div>

                      <FieldArray name={`sections.${sectionIndex}.lessons`}>
                        {({ remove: removeLesson, push: pushLesson }) => (
                          <div className="space-y-6">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="p-4 rounded-lg shadow border border-gray-600"
                              >
                                <div className="flex flex-col mb-4">
                                  <label
                                    className="text-gray-300 font-medium mb-2"
                                    htmlFor={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                                  >
                                    Lesson Title
                                  </label>
                                  <Field
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                                    placeholder="Enter lesson title"
                                    className="border border-gray-600 p-2 rounded-md bg-gray-900 text-white focus:border-blue-500"
                                  />
                                  <ErrorMessage
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.title`}
                                    component="div"
                                    className="text-red-500 mt-1"
                                  />
                                </div>
                                <div className="flex flex-col mb-4">
                                  <label
                                    className="text-gray-300 font-medium mb-2"
                                    htmlFor={`sections.${sectionIndex}.lessons.${lessonIndex}.description`}
                                  >
                                    Lesson Description
                                  </label>
                                  <Field
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.description`}
                                    placeholder="Enter lesson description"
                                    className="border border-gray-600 p-2 rounded-md bg-gray-900 text-white focus:border-blue-500"
                                  />
                                  <ErrorMessage
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.description`}
                                    component="div"
                                    className="text-red-500 mt-1"
                                  />
                                </div>
                                <div className="flex flex-col mb-4">
                                  <label
                                    className="text-gray-300 font-medium mb-2"
                                    htmlFor={`sections.${sectionIndex}.lessons.${lessonIndex}.displayVideo`}
                                  >
                                    Video Upload
                                  </label>

                                  {/* File input for video upload */}
                                  <input
                                    type="file"
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.displayVideo`}
                                    accept="video/*"
                                    onChange={handleFileChange(
                                      sectionIndex,
                                      lessonIndex,
                                      setFieldValue
                                    )}
                                    ref={(ref) =>
                                      (fileInputRefs.current[
                                        `${sectionIndex}-${lessonIndex}`
                                      ] = ref)
                                    }
                                    className="text-white"
                                  />

                                  {/* Show error message if any */}
                                  <ErrorMessage
                                    name={`sections.${sectionIndex}.lessons.${lessonIndex}.v`}
                                    component="div"
                                    className="text-red-500 mt-1"
                                  />

                                  {/* Display the video preview if a file is selected */}
                                  {previewUrls[
                                    `${sectionIndex}-${lessonIndex}`
                                  ] ? (
                                    <video
                                      src={
                                        previewUrls[
                                          `${sectionIndex}-${lessonIndex}`
                                        ]
                                      }
                                      controls
                                      className="mt-2 w-full h-64 bg-black rounded-lg"
                                    />
                                  ) : /* Display video from Redux if the video has been uploaded previously */
                                  lesson.displayVideo ? (
                                    <video
                                      src={lesson.displayVideo}
                                      controls
                                      className="mt-2 w-full h-64 bg-black rounded-lg"
                                    />
                                  ) : null}
                                </div>

                                <div className="flex justify-end space-x-4">
                                <button type="button" className="text-red-500" onClick={() => handleRemoveLesson(sectionIndex, lessonIndex, removeLesson)}>Remove Lesson</button>
                                  {/* <button
                                    type="button"
                                    className="text-blue-500"
                                    onClick={() =>
                                      handleS3Upload(
                                        sectionIndex,
                                        lessonIndex,
                                        lesson.title,
                                        section.title,
                                        lesson.description
                                      )
                                    }
                                  >
                                    Upload Video
                                  </button> */}
                                  <React.Fragment>
                                    <Button
                                      variant="outlined"
                                      color="neutral"
                                      onClick={() =>
                                        handleS3Upload(
                                          sectionIndex,
                                          lessonIndex,
                                          lesson.title,
                                          section.title,
                                          lesson.description
                                        )
                                      }
                                    >
                                      Upload Video
                                    </Button>
                                    <Modal
                                      aria-labelledby="modal-title"
                                      aria-describedby="modal-desc"
                                      open={open}
                                      onClose={() => setOpen(false)}
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "50%",
                                        marginLeft: "35%",
                                      }}
                                    >
                                      <LinearProgress
                                        determinate
                                        variant="outlined"
                                        color="neutral"
                                        size="sm"
                                        thickness={24}
                                        value={Number(value!)}
                                        sx={{
                                          "--LinearProgress-radius": "20px",
                                          "--LinearProgress-thickness": "24px",
                                        }}
                                      >
                                        <Typography
                                          level="body-xs"
                                          textColor="common.white"
                                          sx={{
                                            fontWeight: "xl",
                                            mixBlendMode: "difference",
                                          }}
                                        >
                                          LOADING…{" "}
                                          {`${Math.round(Number(value!))}%`}
                                        </Typography>
                                      </LinearProgress>
                                    </Modal>
                                  </React.Fragment>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="text-green-500"
                              onClick={() =>
                                pushLesson({
                                  title: "",
                                  video: null,
                                  description: "",
                                })
                              }
                            >
                              Add Lesson
                            </button>
                          </div>
                        )}
                      </FieldArray>
                      <div className="flex justify-end mt-4">
                      <button type="button" className="text-red-500" onClick={() => handleRemoveSection(sectionIndex, removeSection)}>Remove Section</button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-green-500"
                    onClick={() =>
                      pushSection({
                        title: "",
                        lessons: [{ title: "", video: null, description: "" }],
                      })
                    }
                  >
                    Add Section
                  </button>
                </div>
              )}
            </FieldArray>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditLesson;
