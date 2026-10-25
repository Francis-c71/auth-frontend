import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/3_components/ui/Button';
import { TextField } from '@/3_components/ui/TextField';
import { TextLink } from '@/3_components/ui/TextLink';
import { ApiError } from '@/2_lib/errors';
import { paths } from '@/6_routes/paths';
import { authApi } from '../api/auth.api';
import { AuthHeading } from '../components/AuthHeading';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas';
import { ErrorToast, SuccessToast, } from '@/3_components/ui/Toast';

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<ForgotPasswordValues>({resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' },});

  const onSubmit = handleSubmit(async ({ email }) => {

    setFormError(null);

    try {
      await authApi.forgotPassword(email);
      setSentTo(email);
      setSuccessMessage(`An was email sent to ${email}, click the link in the email to reset your password.`)

    } catch (err) {
      /**  Only surface problems the user can act on (rate limits, network). A 404 must look like success.*/
      if (err instanceof ApiError && (err.status === 0 || err.status === 429 || err.status >= 500)) {
        setFormError(err.message);
      } else {
        setSentTo(email);
      }

    }
  });

  if (sentTo) {
    return (
      <>

        {successMessage && (<SuccessToast message={successMessage} onDismiss={() => setSuccessMessage(null)}/>)}

        <AuthHeading title="Check your email" />
      
        <p className="mt-2 text-center text-white"><TextLink to={paths.login}>Sign In</TextLink></p>

      </>
    );
  }

  return (
    <>
      {formError && (<ErrorToast message={formError} onDismiss={() => setFormError(null)} />)}

      <AuthHeading title="Reset your password" />

      <form onSubmit={onSubmit} noValidate className="space-y-5">

        <TextField placeholder='Email' type="email" autoComplete="email" inputMode="email" autoFocus error={errors.email?.message}{...register('email')} className="bg-gray-800 text-white autofill:[-webkit-text-fill-color:white] autofill:shadow-[inset_0_0_0_1000px_#181820]" />

        <div></div> 

        <Button type="submit" fullWidth loading={isSubmitting}>Send reset link</Button>

      </form>

      <p className="mt-2 text-center">Remembered it? <TextLink to={paths.login} >Sign In</TextLink></p>

    </>
  );
}
