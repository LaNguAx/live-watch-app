export const Error = ({ error }: { error: Error }) => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Something went wrong</h1>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
    </div>
  );
};
