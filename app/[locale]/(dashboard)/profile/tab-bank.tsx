import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Merchant } from "@/src/shemas/entity/merchant.schema";

function TabBank({ merchant }: { merchant: Merchant | undefined }) {
  return (
    <div className="mt-10">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className={"text-2xl"}>
            Settlement currencies and bank accounts
          </CardTitle>
          <CardDescription>
            To accumulate a balance in a new currency, add it here. Attach a
            bank account to pay out the balance. Learn about settlement and
            presentment currencies.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default TabBank;
