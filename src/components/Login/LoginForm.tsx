/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";

import { GoogleButton, GoogleButtonWithText } from "../Atom/GoogleButton";

import EmailForm from "./EmailForm";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface LoginFormContent {
  email: string;
}

interface Errors {
  email?: string;
}

const useLoginForm = () => {
  const [formContent, setFormContent] = useState<LoginFormContent>({
    email: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const emailSchema = z.string().email("Invalid email address");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(value);
    setFormContent((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGoogleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Errors = {};
    try {
      void (await signIn("google"));
    } catch (err) {
      console.log(err);
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      {/* https://tailwindcomponents.com/component/custom-nextauth-login-page */}
      {/* Email Sign In */}
      {/*       <form
        className="p-4 md:p-5 lg:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(e);
        }}
      >
        <div className="grid gap-y-3">
          <p>{errors.email}</p>
          <input
            className="rounded-md border border-slate-600 bg-slate-700 px-4 py-3 text-slate-200 outline-none transition placeholder:text-slate-400 focus:border-purple-400"
            type="text"
            placeholder="Your Email address"
            aria-label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <button className="text-white flex items-center justify-center gap-x-2 rounded-md border border-slate-600 bg-slate-700 px-4 py-3 text-slate-300 transition hover:text-purple-400">
            <svg
              style={{ color: "rgb(203, 213, 225)" }}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-envelope"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                fill="#cbd5e1"
              ></path>
            </svg>
            Sign in with Email
          </button>
        </div>
      </form> */}

      <div className="my-3 flex items-center px-3">
        <hr className="w-full border-slate-600" />
        <span className="mx-3 text-slate-500">or</span>
        <hr className="w-full border-slate-600" />
      </div>

      {/* Google In */}
      <form
        className="p-2 md:p-3 lg:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          void handleGoogleSignIn(e);
        }}
      >
        <div className="grid gap-y-3">
          {/*           <button className="flex items-center justify-center gap-x-2 rounded-md border transition">
            <FcGoogle /> Sign in with Google
          </button> */}
          <GoogleButtonWithText />
        </div>
      </form>
    </>
  );
}
