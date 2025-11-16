export default function Title({
  children,
  addMarginTop,
  additionalClassNames,
}: {
  children: React.ReactNode;
  addMarginTop?: boolean;
  additionalClassNames?: string;
}) {
  return (
    <h1
      className={`mx-auto max-w-6xl text-center text-3xl font-bold text-cyan-50 ${addMarginTop ? 'mt-20' : ''} ${additionalClassNames}`}
    >
      {children}
    </h1>
  );
}
