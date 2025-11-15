export default function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ boxShadow: "0 8px 32px rgba(31,38,135,0.15)" }}
      className={`w-full text-left px-12 py-9 rounded-4xl backdrop-blur-md shadow-lg border border-white/20 ${className}`}
    >
      {children}
    </div>
  );
}
