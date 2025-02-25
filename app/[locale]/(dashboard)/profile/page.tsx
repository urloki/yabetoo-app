"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountDetails from "@/app/[locale]/(dashboard)/profile/account-details";

function Page() {
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
        <TabsContent className="px-10 pt-20 pb-10" value="account">
          <AccountDetails />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
        <TabsContent value="bank">
          {/* <TabBank merchant={merchant} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Page;
