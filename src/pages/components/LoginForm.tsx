import * as z from 'zod';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

// import useLoginForm from '../helpers/useLoginForm';


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

  return { form, errors, handleChange, handleSubmit };
};

const LoginForm = () => {
  const { form, errors, handleChange, handleSubmit } = useLoginForm();

  return (
    <>
      <h2 className="text-accent text-4xl font-bold mb">{'Sign in \u{1F512}'}</h2>

      <form className="w-full py-4" onSubmit={(e) => { e.preventDefault(); void handleSubmit(e) }}>

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
          <button className="text-secondary-content font-bold text-md btn btn-secondary rounded-lg" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="pr-1 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            Send me the Link
          </button>
          
        </div>
      </form>
      <button >Log in with Google</button>
    </>
  );
};

export default LoginForm;
