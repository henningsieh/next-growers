/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from 'zod';

import { Button } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { signIn }       from 'next-auth/react';
import { useState } from 'react';

interface LoginForm {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

  const useLoginForm = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});

  const emailSchema = z.string().email('Invalid email address');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGoogleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Errors = {};
    try {
      await signIn("google");
    } catch (err) {
      // console.log (err);
    }
  
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate email field
    const newErrors: Errors = {};
    try {
      emailSchema.parse(form.email);
      await signIn('email', { email: form.email });
    } catch (err) {
      newErrors.email = (err as Error).message;
    }
  
    setErrors(newErrors);
  };

  return { form, errors, handleChange, handleSubmit , handleGoogleSignIn};
};

export default function LoginForm() {
  const { form, errors, handleChange, handleSubmit, handleGoogleSignIn} = useLoginForm();

  return (
    <>
      {/* <h2 className="text-accent text-2xl font-bold mb">{'Log in to GrowAGram 🔒'}</h2> */}

  {/* OLD FORM */}
  {/* <form className="w-full py-4" onSubmit={(e) => { e.preventDefault(); void handleSubmit(e) }}>
        <div className="flex flex-col relative ">
          {errors.email && (
            <div
              className="tooltip tooltip-open tooltip-error absolute top-4 left-1/2 transform -translate-y-1/2"
              data-tip={errors.email}
            ></div>
          )}

          <input
            className="focus:outline-none my-4 font-bold text-md border-b-2 border-primary 
  text-primary-content appearance-none bg-transparent mr-3 px-2"
            type="text"
            placeholder="Your Email address"
            aria-label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Button leftIcon={<IconMail />}   className="text-secondary-content font-bold text-md btn btn-secondary rounded-lg" type="submit">
            SEND ME THE MAGIC LOGIN LINK
          </Button>
          
        </div>
      </form> */}

      {/* https://tailwindcomponents.com/component/custom-nextauth-login-page */}
      {/* Email Sign In */}
      <form className="p-4 md:p-5 lg:p-6" onSubmit={(e) => { e.preventDefault(); void handleSubmit(e) }}>
        <div className="grid gap-y-3">
          <input
            className="focus:border-purple-400 rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-slate-200 outline-none transition placeholder:text-slate-400"
            
            type="text"
            placeholder="Your Email address"
            aria-label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <button
            className="flex items-center justify-center gap-x-2 rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-slate-300 transition hover:text-purple-400"
          >
            <svg
              style={{ color: 'rgb(203, 213, 225)' }}
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
      </form>

      <div className="my-3 flex items-center px-3">
        <hr className="w-full border-slate-600" />
        <span className="mx-3 text-slate-500">or</span>
        <hr className="w-full border-slate-600" />
      </div>

      {/* Google In */}
      <form className="p-4 md:p-5 lg:p-6" onSubmit={(e) => { e.preventDefault(); void handleGoogleSignIn(e) }}>
        <div className="grid gap-y-3">
          <button
            className="flex items-center justify-center gap-x-2 rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-slate-300 transition hover:text-purple-400"
          >
            <svg
              style={{ color: 'rgb(203, 213, 225)' }}
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="currentColor"
              className="bi bi-google"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                fill="#cbd5e1"
              ></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      </form>

    </>
  );
}
