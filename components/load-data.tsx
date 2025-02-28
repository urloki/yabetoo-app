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
  const { status } = useSession();

  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    data: organizations,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(),
  });

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
    // Ne rien faire si l'authentification est en cours de chargement
    if (status === "loading") return;

    // Ne rien faire si les organisations sont en cours de chargement
    if (isLoading) return;

    console.log("🔴 organizations", organizations);

    // Si nous avons des organisations, les configurer
    if (organizations && organizations.length > 0) {
      setOrganizations(organizations);
      setCurrentOrganization(organizations[0]);

      // Vérifier si l'organisation a des comptes
      if (organizations[0].accounts?.length === 0) {
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
    // Rediriger vers /org uniquement si nous sommes sûrs qu'il n'y a pas d'organisations
    // et que nous ne sommes pas déjà sur la page /org
    else if (
      organizations &&
      organizations.length === 0 &&
      !window.location.pathname.includes("/org")
    ) {
      router.push("/org");
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
