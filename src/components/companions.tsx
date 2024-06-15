import { Companion } from "@prisma/client";
import { AlertTriangle, MessagesSquare } from "lucide-react";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";

interface CompanionsProps {
  data: Companion[];
}

const Companions = ({ data }: CompanionsProps) => {
  if (data.length === 0) {
    return (
      <div className="pt-10 flex flex-col space-y-3 items-center justify-center">
        <div className="relative w-80 h-40">
          <Image
            fill
            className="object-fill grayscale]"
            alt="Empty"
            src="/./empty.jpg"
          />
        </div>
        <AlertTriangle className="text-muted-foreground h-8 w-8" />
        <p className="text-sm text-muted-foreground">No Companions Found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {data.map((item) => {
        return (
          <Card
            key={item.id}
            className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
          >
            <Link href={`/chat/${item.id}`}>
              <CardHeader className="flex items-center justify-center text-muted-foreground">
                <div className="relative w-32 h-32">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="rounded-xl object-fill h-full w-full"
                  />
                </div>
                <p className="font-bold">{item.name}</p>
                <p className="text-xs">{item.description}</p>
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                <p>@{item.userName}</p>
              </CardFooter>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

export default Companions;
