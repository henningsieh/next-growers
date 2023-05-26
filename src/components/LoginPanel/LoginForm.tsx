/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";

import { GoogleButtonWithText } from "../Atom/GoogleButton";

import EmailForm from "./EmailForm";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface LoginFormContent {
  email: string;
}

interface Errors {
  email?: string;
}

const useLoginForm = () => {
  const [formContent, setFormContent] =
    useState<LoginFormContent>({
      email: "",
    });
  const [errors, setErrors] = useState<Errors>({});

  const emailSchema = z.string().email("Invalid email address");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    console.log(value);
    setFormContent(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const newErrors: Errors = {};
    try {
      void (await signIn("google"));
    } catch (err) {
      console.log(err);
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // Validate email field
    const newErrors: Errors = {};
    try {
      emailSchema.parse(formContent.email);
      await signIn("email", { email: formContent.email });
    } catch (err) {
      newErrors.email = (err as Error).message;
    }
    console.log(newErrors.email);
    setErrors(newErrors);
  };

  return {
    form: formContent,
    errors,
    handleChange,
    handleSubmit,
    handleGoogleSignIn,
  };
};

export default function LoginForm() {
  const { handleGoogleSignIn } = useLoginForm();

  return (
    <>
      <EmailForm />

      <div className="my-3 flex items-center px-3">
        <hr className="w-full border-slate-600" />
        <span className="mx-3 text-slate-500">or</span>
        <hr className="w-full border-slate-600" />
      </div>

      {/* Google In */}
      <form
        className="p-2 md:p-3 lg:p-4"
        onSubmit={e => {
          e.preventDefault();
          void handleGoogleSignIn(e);
        }}
      >
        <div className="grid gap-y-3">
          <GoogleButtonWithText />
        </div>
      </form>
    </>
  );
}
