import * as z from 'zod';

import  {  type ChangeEvent, type FormEvent, useState } from 'react';

type FormValues = {
  email: string;
  password: string;
};

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const schema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const useLoginForm = () => {
  const [form, setForm] = useState<FormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    try {
      schema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0]] = error.message;
          }
        });
        setErrors(errors);
      }
      return false;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      alert('los');
    }
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useLoginForm;
