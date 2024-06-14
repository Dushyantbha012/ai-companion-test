import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) auth().redirectToSignIn();
  return (
    <div className="h-full">
      <Navbar />
      <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
};

export default RootLayout;
