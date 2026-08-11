import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";

const signupSchema = Yup.object({
  name: Yup.string().trim().required("Name is required."),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Use at least 8 characters.")
    .required("Password is required."),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm your password."),
});

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirm: "" },
    validationSchema: signupSchema,
    onSubmit(values, { setStatus, setSubmitting }) {
      try {
        signup(values);
        navigate("/watchlist", { replace: true });
      } catch (error) {
        // Duplicate-email rejections come back from the auth layer, not Yup.
        setStatus(error.message);
        // onSubmit is synchronous, so Formik won't reset this for us.
        setSubmitting(false);
      }
    },
  });

  // Hold a field's error back until the user has left it or tried to submit —
  // flagging "Name is required" on an untouched form is just noise.
  function errorFor(field) {
    return formik.touched[field] ? formik.errors[field] : undefined;
  }

  // Any edit invalidates the previous rejection, so clear it as they type.
  function handleChange(event) {
    if (formik.status) formik.setStatus(undefined);
    formik.handleChange(event);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-sora text-3xl font-semibold text-ink">
          Create an account
        </h1>
        <p className="text-sm text-ink-subtle">
          Your account is stored on this device only.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Name"
          autoComplete="name"
          {...formik.getFieldProps("name")}
          onChange={handleChange}
          error={errorFor("name")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...formik.getFieldProps("email")}
          onChange={handleChange}
          error={errorFor("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...formik.getFieldProps("password")}
          onChange={handleChange}
          error={errorFor("password")}
          hint="At least 8 characters."
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...formik.getFieldProps("confirm")}
          onChange={handleChange}
          error={errorFor("confirm")}
        />

        {formik.status && (
          <p role="alert" className="text-sm text-danger">
            {formik.status}
          </p>
        )}

        <Button type="submit" disabled={formik.isSubmitting} className="w-full">
          {formik.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-ink-subtle">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Signup;
