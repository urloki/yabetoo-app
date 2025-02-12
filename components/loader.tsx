import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function Loader({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {isLoading ? (
        <div className="mt-20 p-10">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-4 w-[550px]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default Loader;
