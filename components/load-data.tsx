"use client";

import { signOut, useSession } from "next-auth/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FlipWords } from "@/components/ui/flip-words";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {getAccounts} from "@/src/actions/account/get-accounts.action";

function Loader({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const words = ["paiements", "clients", "analytiques", "produits"];

  return (
    <div className="h-screen w-full bg-background">
      {isLoading ? (
        <div className="flex h-[40rem] flex-col justify-center px-5 md:px-10">
          <div className="text-2xl font-normal text-neutral-600 dark:text-neutral-400 md:text-4xl">
            Récuperation de vos
            <FlipWords words={words} /> <br />
            merci pour votre patience.
          </div>
          <Icons.spinner className="mt-5 h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function LoadData({ children }: { children: React.ReactNode }) {
  const { currentAccount, setAccounts, setCurrentAccount } = useAccountAtom();
  const { data: session, status } = useSession();
  const { data, isError } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  });

  if (isError) {
    signOut().then(() => {
      toast.error("Votre session a expiré, veuillez vous reconnecter");
    });
  }

  const [dataLoaded, setDataLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user.accountConfirmed === false || data?.length === 0) {
      router.push("/setup");
    } else if (data) {
      if (!currentAccount && data) {
        setAccounts(data);
        setCurrentAccount(data[0]);
      }
      setDataLoaded(true);
    }
  }, [
    session?.user.accountConfirmed,
    status,
    router,
    data,
    currentAccount,
    setAccounts,
    setCurrentAccount,
  ]);

  return <Loader isLoading={!dataLoaded}>{children}</Loader>;
}

export default LoadData;
