"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountDetails from "@/app/[locale]/(dashboard)/profile/account-details";
import TabBank from "@/app/[locale]/(dashboard)/profile/tab-bank";
import { getMerchantDetail } from "@/src/actions/entities/get-merchant.action";

function Page() {
  const { data: merchant } = useQuery({
    queryKey: ["merchant"],
    queryFn: () => getMerchantDetail(),
  });

  return (
    <div className="mt-[75px] w-full">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="fixed w-full px-10 pt-7">
          <TabsTrigger value="account">Account details</TabsTrigger>
          {/* <TabsTrigger variant="underline" value="password">
            Password
          </TabsTrigger>
          <TabsTrigger variant="underline" value="bank">
            Banks account and currencies
          </TabsTrigger>*/}
        </TabsList>
        <TabsContent className="px-10 pb-10 pt-20" value="account">
          <AccountDetails />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
        <TabsContent value="bank">
          <TabBank merchant={merchant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Page;
