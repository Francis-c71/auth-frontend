
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ErrorToast, SuccessToast, } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { PasswordField } from '@/components/ui/PasswordField';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { applyApiError } from '@/lib/forms';
import { paths } from '@/routes/paths';
import { AuthHeading } from '../auth-components/AuthHeading';
import { useAuth } from '../auth-context/useAuth';
import { registerSchema, type RegisterValues } from '../auth-schemas';

export function RegisterPage() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }, } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: {name: '', email: '', password: '', confirmPassword: '',}, });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async ({ name, email, password }) => {

    setFormError(null);

    try {

      const { verificationRequired } = await signUp({name, email, password, });
      
      setSuccessMessage('Your account was created successfully.');

      /** If the backend signed the user in, <GuestRoute> takes over from here.*/
      if (verificationRequired) {
        navigate(paths.verifyEmail, { state: { email } });
      }

    } catch (err) {
      setFormError(applyApiError(err, setError, ['name', 'email', 'password'], 'Couldn’t create your account. Try again.',), );

    }
  
  });

  return (
    <>
      {formError && (<ErrorToast message={formError} onDismiss={() => setFormError(null)} />)}

      {successMessage && (<SuccessToast message={successMessage} onDismiss={() => setSuccessMessage(null)} />)}

      <AuthHeading title="Sign Up." />

      <form onSubmit={onSubmit} noValidate className="space-y-5">

        <TextField placeholder="Full name" autoComplete="name" autoFocus error={errors.name?.message}{...register('name')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />

        <TextField placeholder="Email" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} {...register('email')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />

        <div>
          <PasswordField placeholder="Password" autoComplete="new-password" error={errors.password?.message}{...register('password')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordField placeholder="Confirm password" autoComplete="new-password" error={errors.confirmPassword?.message}{...register('confirmPassword')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />

        <div />

        <Button type="submit" fullWidth loading={isSubmitting} className="mt-8">Sign Up</Button>

      </form>

      <p className="mt-2 text-center text-white">Already have an account?{' '}<TextLink to={paths.login}>Sign In</TextLink></p>

    </>
  );
  
}
