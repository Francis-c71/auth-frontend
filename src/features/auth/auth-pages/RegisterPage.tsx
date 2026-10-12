import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
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

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setFormError(null);
    try {
      const { verificationRequired } = await signUp({ name, email, password });
      // If the backend signed the user in, <GuestRoute> takes over from here.
      if (verificationRequired) navigate(paths.verifyEmail, { state: { email } });
    } catch (err) {
      setFormError(
        applyApiError(err, setError, ['name', 'email', 'password'], 'Couldn’t create your account. Try again.'),
      );
    }
  });

  return (
    <>
      <AuthHeading title="Sign Up."/>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Alert variant="error" >Something wrong happend!</Alert>}

         
        <TextField
          placeholder='Full name'
          autoComplete="name"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
    
        />

        <TextField
          placeholder='Email'
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email')}

        />

        <div>
          <PasswordField
            placeholder='Password'
            autoComplete="new-password"
            // hint="At least 8 characters, with a letter and a number."
            error={errors.password?.message}
            {...register('password')}
            />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordField
          placeholder='Confirm password'
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        
        {/* <Space bar */}
        <div></div>

        <Button type="submit" fullWidth loading={isSubmitting} className='mt-8'>
          Sign Up
        </Button>
      </form>

      <p className="mt-2 text-center text-white">
        Already have an account? <TextLink to={paths.login} className='text-gradient3 no-underline hover:text-gradient2'>Sign In</TextLink>
      </p>
    </>
  );
} 
