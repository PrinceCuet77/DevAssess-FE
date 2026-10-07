function FieldError({ errors }: { errors: unknown[] }) {
  const message = errors
    .map((error) => {
      if (typeof error === 'string') return error;
      if (error && typeof error === 'object' && 'message' in error) return String(error.message);
      return null;
    })
    .filter(Boolean)
    .join(', ');

  if (!message) return null;
  return (
    <p role='alert' className='text-xs text-destructive'>
      {message}
    </p>
  );
}

export default FieldError;
