import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/3_components/ui/Button';
import { PasswordField } from '@/3_components/ui/PasswordField';
import { TextField } from '@/3_components/ui/TextField';
import { TextLink } from '@/3_components/ui/TextLink';
import { EMAIL_NOT_VERIFIED_CODE } from '@/1_config/endpoints';
import { ApiError } from '@/2_lib/errors';
import { applyApiError } from '@/2_lib/forms';
import { paths } from '@/6_routes/paths';
import { AuthHeading } from '../components/AuthHeading';
import { useAuth } from '../context/useAuth';
import { loginSchema, type LoginValues } from '../schemas';
import { ErrorToast, SuccessToast } from '@/3_components/ui/Toast';
import { ThemeToggle } from '@/3_components/ui/ThemeToggle';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  

  const notice = (location.state as { notice?: string } | null)?.notice;
  const [successMessage, setSuccessMessage] = useState<string | null>(notice ?? null);
  

  const { register, handleSubmit, setError, formState: { errors, isSubmitting }, } = useForm<LoginValues>({resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' },});

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      /**  On success AuthProvider updates, and <GuestRoute> redirects to the page the user wanted.*/
      await login(values);
  
    } catch (err) {
      if (err instanceof ApiError && err.code === EMAIL_NOT_VERIFIED_CODE) {
        navigate(paths.verifyEmail, { 
          state: { 
            email: values.email,
            notice: "Please verify your email before logging in.",
            },
          }
        );
        return;
      }

      if (err instanceof ApiError && err.status === 401) {
        setFormError('Email or password is incorrect.');
        return;
      }
      setFormError(applyApiError(err, setError, ['email', 'password'], 'Couldn’t sign you in. Try again.'));
    }
  });

  return (
    <>

    {formError && (<ErrorToast message={formError} onDismiss={() => setFormError(null)} />)}
    {successMessage && (<SuccessToast message={successMessage} onDismiss={() => setSuccessMessage(null)} />)}

      <AuthHeading title="Sign In" />

      <form onSubmit={onSubmit} noValidate className="space-y-5">

        <TextField placeholder='Email' type="email" autoComplete="email" inputMode="email" autoFocus error={errors.email?.message}{...register('email')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />

        <div>
          <PasswordField placeholder='Password' autoComplete="current-password" error={errors.password?.message}{...register('password')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />
          <p className="mt-2 text-right text-sm"><TextLink to={paths.forgotPassword}>Forgot your password?</TextLink></p> 
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>Sign In</Button>


      </form>

      <p className="mt-2 text-center">Don't have an account? <TextLink to={paths.register}>Sign Up</TextLink></p>

      <ThemeToggle />
                <div className="bg-white text-navyBrand dark:bg-background dark:text-white">
                        Theme test
                </div>
    </>
  );
}
