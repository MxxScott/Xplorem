import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit(values, { setStatus, setSubmitting }) {
      try {
        login(values);
        navigate(location.state?.from || "/watchlist", { replace: true });
      } catch (error) {
        // A bad email/password pair isn't tied to a single field, so it goes to
        // form-level status rather than setFieldError.
        setStatus(error.message);
        // onSubmit is synchronous, so Formik won't reset this for us.
        setSubmitting(false);
      }
    },
  });

  // Hold a field's error back until the user has left it or tried to submit —
  // flagging "Email is required" on an untouched form is just noise.
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
        <h1 className="font-sora text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="text-sm text-ink-subtle">
          Sign in to reach your watchlist and reviews.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
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
          autoComplete="current-password"
          {...formik.getFieldProps("password")}
          onChange={handleChange}
          error={errorFor("password")}
        />

        {formik.status && (
          <p role="alert" className="text-sm text-danger">
            {formik.status}
          </p>
        )}

        <Button type="submit" disabled={formik.isSubmitting} className="w-full">
          {formik.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-ink-subtle">
        No account?{" "}
        <Link to="/signup" className="font-bold text-brand hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default Login;
