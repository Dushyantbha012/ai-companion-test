import SearchInput from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import Categories from "@/components/categories";
import Companions from "@/components/companions";
import { auth } from "@clerk/nextjs/server";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

export default async function RootPage({ searchParams }: RootPageProps) {
  const { userId } = auth();
  if (!userId) {
    return auth().redirectToSignIn();
  }
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      userId: userId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prismadb.category.findMany();
  return (
    <div className="h-full p-4 space-y-2 ">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
}
