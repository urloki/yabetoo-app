"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getAccounts } from "@/src/actions/account/get-accounts.action";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAccountAtom } from "@/src/atoms/account.atom";

export default function Page() {
  const t = useTranslations("account");
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId");
  const { currentOrganization } = useAccountAtom();

  console.log(currentOrganization);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const accountsWithoutOrg =
    accounts?.filter((account) => account.organizationId === null) || [];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl pt-20 md:pl-40">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {accountsWithoutOrg.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("transferTitle")}</CardTitle>
              <CardDescription className="space-y-4">
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("transferExplanation"),
                  }}
                />
                <p>
                  {t("transferDescription")} {currentOrganization?.name}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="space-y-4">
                  {accountsWithoutOrg.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-medium">
                        {account.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => router.push("/org")}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement transfer all accounts action
                    console.log(
                      "Transfer accounts",
                      accountsWithoutOrg.map((a) => a.id),
                      "to organization",
                      organizationId,
                    );
                  }}
                >
                  {t("transferButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("createTitle")}</CardTitle>
              <CardDescription>{t("createDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => router.push("/org")}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement create account action
                    console.log(
                      "Create new account for organization",
                      organizationId,
                    );
                  }}
                >
                  {t("createButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
