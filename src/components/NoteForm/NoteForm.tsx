import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import { useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import { useId } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as Yup from "yup";
interface NoteFormProps {
    onClose: ()=>void;
}
interface NoteFormValues {
  title: string;
  content: string;
  tag: "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
}
const INITIAL_VALUES: NoteFormValues = {
  title: "",
  content: "",
  tag: "Work",
};
const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, "Too short")
    .max(50, "Too long")
    .required("Title is required"),
 content: Yup.string()
  .max(500, "Too long"),
 
  tag: Yup.string()
    .oneOf(["Work","Personal","Meeting","Shopping","Todo"])
    .required("Tag is required"),
   
});
export default function NoteForm({onClose}: NoteFormProps) {
  const id = useId();
  const queryClient = useQueryClient();
  const { mutate,isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {queryClient.invalidateQueries({ queryKey: ["notes"] });},
    onError: () => {toast.error("Failed to create note. Please try again.");},
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    mutate(values, { onSuccess: () => {actions.resetForm(); onClose()} });
  };
  
  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={NoteSchema} onSubmit={handleSubmit}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${id}-title`}>Title</label>
          <Field
            id={`${id}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${id}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${id}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${id}-tag`}>Tag</label>
          <Field as="select" id={`${id}-tag`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>

          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton}  onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
