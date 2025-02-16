"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlipWords } from "@/components/ui/flip-words";
import { Icons } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "@/src/actions/oraganization.action";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { toast } from "sonner";

function Loader({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const words = ["paiements", "clients", "analytiques", "produits"];

  return (
    <div className="bg-background w-full">
      {isLoading ? (
        <div className="flex h-[40rem] flex-col justify-center px-5 md:px-10">
          <div className="text-2xl font-normal text-neutral-600 md:text-4xl dark:text-neutral-400">
            Récuperation de vos
            <FlipWords words={words} /> <br />
            merci pour votre patience.
          </div>
          <Icons.spinner className="text-primary mt-5 h-10 w-10 animate-spin" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

function LoadData({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log("🔴 session", session);

  const [dataLoaded, setDataLoaded] = useState(false);

  const { data: organizations, isError } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(),
  });

  console.log("🔴 organizations", organizations);

  const {
    currentAccount,
    setAccounts,
    setCurrentAccount,
    setCurrentOrganization,
    setOrganizations,
  } = useAccountAtom();

  if (isError) {
    signOut().then(() => {
      toast.error("Votre session a expiré, veuillez vous reconnecter");
    });
  }

  useEffect(() => {
    if (status === "loading") return;

    if (organizations?.length === 0) {
      router.push("/setup");
    } else if (organizations && organizations?.length > 0) {
      if (organizations[0].accounts.length === 0) {
        router.push("/setup");
      } else if (organizations) {
        setOrganizations(organizations);
        setCurrentOrganization(organizations[0]);
        setCurrentAccount(organizations[0].accounts[0]);
        setDataLoaded(true);
        console.log("🔴 currentAccount", currentAccount);
      }
    }
  }, [
    currentAccount,
    organizations,
    router,
    setCurrentAccount,
    setCurrentOrganization,
    setOrganizations,
  ]);

  /*
    
    
    
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
      ]);*/

  return <Loader isLoading={!dataLoaded}>{children}</Loader>;
}

export default LoadData;
