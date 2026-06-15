const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className={`${sizes[size]} rounded-full border-4 border-dark-600 border-t-gold-500 animate-spin`} />
      {text && <p className="text-dark-200 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
