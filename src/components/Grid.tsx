export default function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>{children}</div>
  );
}
