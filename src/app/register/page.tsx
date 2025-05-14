"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AUTH_TEST_IDS } from "@/utils/testIds";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateField = async (field: string, value: string) => {
    if (!touchedFields[field]) return;

    try {
      // Create a partial schema for the specific field
      const fieldSchema = yup.object().shape({
        [field]: validationSchema.fields[field],
      });

      // Validate just this field
      await fieldSchema.validate({ [field]: value }, { abortEarly: false });

      // If validation passes, remove any error for this field
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Extract the error message for this field
        const fieldError = error.inner.find(
          (err) => err.path === field
        )?.message;

        if (fieldError) {
          setFieldErrors((prev) => ({
            ...prev,
            [field]: fieldError,
          }));
        }
      }
    }

    // Special case for confirmPassword when password changes
    if (field === "password" && touchedFields.confirmPassword) {
      validateField("confirmPassword", confirmPassword);
    }
  };

  // Run validation whenever a field value changes
  useEffect(() => {
    validateField("name", name);
  }, [name]);

  useEffect(() => {
    validateField("email", email);
  }, [email]);

  useEffect(() => {
    validateField("password", password);
  }, [password]);

  useEffect(() => {
    validateField("confirmPassword", confirmPassword);
  }, [confirmPassword]);

  const validateForm = async () => {
    // Mark all fields as touched
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    try {
      await validationSchema.validate(
        {
          name,
          email,
          password,
          confirmPassword,
        },
        { abortEarly: false }
      );

      setFieldErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Transform Yup's errors into our fieldErrors format
        const newErrors: { [key: string]: string } = {};

        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });

        setFieldErrors(newErrors);
      }
      return false;
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields({ ...touchedFields, [field]: true });
    validateField(
      field,
      field === "name"
        ? name
        : field === "email"
        ? email
        : field === "password"
        ? password
        : confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setError(null);
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-md w-full space-y-8"
        data-testid={AUTH_TEST_IDS.registerForm}
      >
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Personal Finance Tracker
          </h1>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
            Create a new account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded"
              data-testid="register-error"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="John Doe"
              error={fieldErrors.name}
              required
              testId={AUTH_TEST_IDS.nameInput}
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="email@example.com"
              error={fieldErrors.email}
              required
              testId={AUTH_TEST_IDS.emailInput}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="••••••••"
              error={fieldErrors.password}
              required
              testId={AUTH_TEST_IDS.passwordInput}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="••••••••"
              error={fieldErrors.confirmPassword}
              required
              testId={AUTH_TEST_IDS.confirmPasswordInput}
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              testId={AUTH_TEST_IDS.registerButton}
            >
              Create Account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
