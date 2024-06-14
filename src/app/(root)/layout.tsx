import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/navigation/navbar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) auth().redirectToSignIn();
  return (
    <div className="h-full">
      <Navbar />
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
};

export default RootLayout;
