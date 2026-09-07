import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiLock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";
import signupBackground from "../assets/auth/signup-bg.png";

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
  terms: Yup.boolean().oneOf([true], "Accept the terms to continue."),
});

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
    validationSchema: signupSchema,
    onSubmit(values, { setStatus, setSubmitting }) {
      try {
        signup(values);
        navigate("/watchlist", { replace: true });
      } catch (error) {
        setStatus(error.message);
        setSubmitting(false);
      }
    },
  });

  function errorFor(field) {
    return formik.touched[field] ? formik.errors[field] : undefined;
  }

  function handleChange(event) {
    if (formik.status) formik.setStatus(undefined);
    formik.handleChange(event);
  }

  return (
    <AuthShell
      background={signupBackground}
      brand="above"
      cardClassName="max-w-[512px] rounded-2xl"
      footer={
        <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-xs uppercase tracking-wider text-ink-muted/40">
          <span>Ultra HD</span>
          <span>No Ads</span>
          <span>Offline</span>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-sora text-3xl font-semibold leading-tight text-ink">
            Begin Your Cinema
            <br />
            Journey.
          </h1>
          <p className="text-base text-ink-muted">
            Join explorers and start your personalized watchlist.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
          <Input
            appearance="auth"
            label="Full name"
            autoComplete="name"
            placeholder="Enter your full name"
            icon={<FiUser aria-hidden="true" size={16} />}
            {...formik.getFieldProps("name")}
            onChange={handleChange}
            error={errorFor("name")}
          />
          <Input
            appearance="auth"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="explorer@xplorem.com"
            icon={<FiMail aria-hidden="true" size={16} />}
            {...formik.getFieldProps("email")}
            onChange={handleChange}
            error={errorFor("email")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              appearance="auth"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<FiLock aria-hidden="true" size={16} />}
              {...formik.getFieldProps("password")}
              onChange={handleChange}
              error={errorFor("password")}
            />
            <Input
              appearance="auth"
              label="Confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<FiShield aria-hidden="true" size={16} />}
              {...formik.getFieldProps("confirm")}
              onChange={handleChange}
              error={errorFor("confirm")}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-ink-muted">
            <input
              type="checkbox"
              name="terms"
              checked={formik.values.terms}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 size-4 rounded border-border bg-surface accent-brand"
            />
            <span>
              I agree to the{" "}
              <span className="text-brand underline underline-offset-2">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-brand underline underline-offset-2">
                Privacy Policy
              </span>
              .
            </span>
          </label>
          {errorFor("terms") && (
            <p role="alert" className="-mt-3 text-sm text-danger">
              {errorFor("terms")}
            </p>
          )}

          {formik.status && (
            <p role="alert" className="text-sm text-danger">
              {formik.status}
            </p>
          )}

          <Button
            type="submit"
            size="auth"
            radius="xl"
            disabled={formik.isSubmitting}
            className="w-full"
          >
            {formik.isSubmitting ? "Creating account..." : "Create Account"}
            <FiArrowRight aria-hidden="true" size={16} />
          </Button>
        </form>

        <div className="flex flex-col gap-1 border-t border-border/40 pt-5">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">
            Already an explorer?
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-base text-ink hover:text-brand"
          >
            Sign in to your account
            <FiArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

export default Signup;
