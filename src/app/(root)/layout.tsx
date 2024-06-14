import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

const Layout = ({ children }: { children: ReactNode }) => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) auth().redirectToSignIn();
  return <div>{children}</div>;
};

export default Layout;
