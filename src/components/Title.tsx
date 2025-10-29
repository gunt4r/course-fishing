export default function Title({
  children,
  additionalClassNames,
}: {
  children: React.ReactNode;
  additionalClassNames?: string;
}) {
  return (
    <h1
      className={`text-3xl text-center mx-auto text-cyan-50 max-w-6xl font-bold ${additionalClassNames}`}
    >
      {children}
    </h1>
  );
}
