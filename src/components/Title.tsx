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
      className={`text-3xl text-center mx-auto text-cyan-50 max-w-6xl font-bold ${addMarginTop ? "mt-20" : ""} ${additionalClassNames}`}
    >
      {children}
    </h1>
  );
}
