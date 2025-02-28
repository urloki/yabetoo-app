"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlipWords } from "@/components/ui/flip-words";
import { Icons } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "@/src/actions/organization/oraganization.action";
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

export function LoadData({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log("🔴 session", session);

  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    data: organizations,
    isError,
    isLoading,
  } = useQuery({
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
    accounts,
  } = useAccountAtom();

  if (isError) {
    signOut().then(() => {
      toast.error("Votre session a expiré, veuillez vous reconnecter");
    });
  }

  useEffect(() => {
    if (status === "loading") return;

    if (isLoading) return;

    if (organizations && organizations?.length === 0) {
      router.push("/org");
    } else if (organizations && organizations?.length > 0) {
      setOrganizations(organizations);
      setCurrentOrganization(organizations[0]);
      if (organizations[0].accounts.length === 0) {
        router.push("/account");
      } else if (!currentAccount && organizations) {
        setCurrentAccount(organizations[0].accounts[0]);
        setAccounts(organizations[0].accounts);
        setDataLoaded(true);
        console.log("🔴 currentAccount", currentAccount);
      } else {
        setDataLoaded(true);
      }
    }
  }, [
    accounts,
    currentAccount,
    organizations,
    router,
    setAccounts,
    setCurrentAccount,
    setCurrentOrganization,
    setOrganizations,
    status,
    isLoading,
  ]);

  return <Loader isLoading={!dataLoaded}>{children}</Loader>;
}
