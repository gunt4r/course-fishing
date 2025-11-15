import { setRequestLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import SideBar from "@/components/Admin/Dashboard/Sidebar";
export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <>
      <Toaster position="bottom-right" />
      <main className="flex items-center">
        <SideBar />
        {props.children}
      </main>
    </>
  );
}
