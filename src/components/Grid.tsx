export default function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-y-20 mt-10 place-items-center gap-x-10 ${className}`}>{children}</div>
  );
}
