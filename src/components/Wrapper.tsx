export default function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}
      className={`w-full rounded-4xl border border-white/20 px-12 py-9 text-left shadow-lg backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
