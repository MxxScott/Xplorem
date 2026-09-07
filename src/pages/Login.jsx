import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiMonitor, FiShield } from "react-icons/fi";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";
import loginBackground from "../assets/auth/login-bg.png";

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
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit(values, { setStatus, setSubmitting }) {
      try {
        login(values);
        navigate(location.state?.from || "/watchlist", { replace: true });
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
      background={loginBackground}
      brand="inline"
      cardClassName="max-w-[480px] gap-8 rounded-xl p-8 sm:p-12"
      footer={
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-ink">
          <span className="inline-flex items-center gap-2">
            <FiShield aria-hidden="true" size={14} className="text-brand" />
            End-to-End Encryption
          </span>
          <span className="inline-flex items-center gap-2">
            <FiMonitor aria-hidden="true" size={14} className="text-brand" />
            4K Stream Ready
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-sora text-3xl font-semibold leading-tight text-ink">
            Welcome back,
            <br />
            Cinephile.
          </h1>
          <p className="text-base text-ink-muted">
            Step back into the world of ultra-high definition.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
          <Input
            appearance="auth"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<FiMail aria-hidden="true" size={16} />}
            {...formik.getFieldProps("email")}
            onChange={handleChange}
            error={errorFor("email")}
          />
          <Input
            appearance="auth"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<FiLock aria-hidden="true" size={16} />}
            labelAside={
              <span className="font-mono text-xs text-brand">Forgot password?</span>
            }
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-ink-subtle transition-colors hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff aria-hidden="true" size={16} />
                ) : (
                  <FiEye aria-hidden="true" size={16} />
                )}
              </button>
            }
            {...formik.getFieldProps("password")}
            onChange={handleChange}
            error={errorFor("password")}
          />

          {formik.status && (
            <p role="alert" className="text-sm text-danger">
              {formik.status}
            </p>
          )}

          <Button
            type="submit"
            size="auth"
            radius="lg"
            disabled={formik.isSubmitting}
            className="w-full"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
            <FiArrowRight aria-hidden="true" size={16} />
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border/60" />
          <span className="font-mono text-xs uppercase tracking-wide text-ink-faint">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            title="Local accounts only — social sign-in is not available."
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border font-mono text-sm font-medium text-ink opacity-60"
          >
            Google
          </button>
          <button
            type="button"
            disabled
            title="Local accounts only — social sign-in is not available."
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border font-mono text-sm font-medium text-ink opacity-60"
          >
            Apple
          </button>
        </div>

        <p className="text-center text-base text-ink-muted">
          New to Xplorem?{" "}
          <Link to="/signup" className="font-medium text-brand hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default Login;
