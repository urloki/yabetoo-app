"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAccountAtom } from "@/src/atoms/account.atom";

function AccountDetails() {
  const { currentAccount } = useAccountAtom();

  return (
    <div className={"mt-5"}>
      <Card className="w-1/2 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Account Settings</CardTitle>
            <div className="text-sm">{currentAccount?.id}</div>
          </div>
        </CardHeader>
        <CardContent className="border-b border-t">
          <div className="py-10">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="name">Account name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                value={currentAccount?.name}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-3 pt-10">
              <Label htmlFor="country">Country</Label>
              <Select disabled value={currentAccount?.country.name}>
                <SelectTrigger className="w-[380px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent defaultValue={currentAccount?.country.name}>
                  <SelectItem value={currentAccount?.country.name ?? ""}>
                    {currentAccount?.country.name}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-5">
          <div className="flex justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AccountDetails;
