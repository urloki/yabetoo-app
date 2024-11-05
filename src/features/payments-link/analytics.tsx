
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { numberFormat } from "@/lib/utils";
import {PaymentLink} from "@/src/shemas/payments-link/schema";
import {useAccountAtom} from "@/src/atoms/account.atom";
import {IntentDataTable} from "@/src/features/intents/table/data-table";
import {intentColumns} from "@/src/features/intents/table/column"; // biome-ignore lint/correctness/noUnusedVariables: <explanation>

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
function getCurrentWeekDates() {
  const today = new Date();
  let firstDayOfWeek = today.getDate() - today.getDay() + 1; // Get Monday (first day of the week)

  if (today.getDay() === 0) {
    // If today is Sunday, subtract 6 days to get Monday of the current week
    firstDayOfWeek -= 7;
  }

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today.setDate(firstDayOfWeek + i));
    weekDates.push(currentDate.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
  }

  return weekDates;
}

function getCurrentDates(option: "week" | "month") {
  const today = new Date();

  if (option === "week") {
    let firstDayOfWeek = today.getDate() - today.getDay() + 1; // Get Monday (first day of the week)

    if (today.getDay() === 0) {
      // If today is Sunday, subtract 6 days to get Monday of the current week
      firstDayOfWeek -= 7;
    }

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(firstDayOfWeek + i);
      weekDates.push(currentDate.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
    }

    return weekDates;
  }
  if (option === "month") {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    );

    const monthDates = [];
    for (
      let d = firstDayOfMonth;
      d <= lastDayOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      monthDates.push(d.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
    }

    return monthDates;
  }
  return [];
}

const getAmount = (intents: any[]) => {
  return intents.reduce((acc, intent) => {
    return acc + intent.amount;
  }, 0);
};

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const getAmountByDay = (intents: any[]) => {
  const amountByDay = intents.reduce(
    (acc, intent) => {
      const date = new Date(intent.createdAt).toLocaleDateString();
      if (acc[date]) {
        acc[date] += intent.amount;
      } else {
        acc[date] = intent.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
  return amountByDay;
};

const getAmountForToday = (intents: any[]) => {
  const today = new Date().toLocaleDateString();
  return intents.reduce((acc, intent) => {
    if (new Date(intent.createdAt).toLocaleDateString() === today) {
      return acc + intent.amount;
    }
    return acc;
  }, 0);
};

const getAmountForTheMonth = (intents: any[]) => {
  const monthDates = getCurrentDates("month");
  return intents.reduce((acc, intent) => {
    if (
      monthDates.includes(
        new Date(intent.createdAt).toISOString().split("T")[0],
      )
    ) {
      return acc + intent.amount;
    }
    return acc;
  }, 0);
};

const getAmountForCurrentWeek = (intents: any[]) => {
  // generate array of dates for the current week

  const weekDates = getCurrentDates("week");

  return intents.reduce((acc, intent) => {
    if (
      weekDates.includes(new Date(intent.createdAt).toISOString().split("T")[0])
    ) {
      return acc + intent.amount;
    }
    return acc;
  }, 0);
};

function Analytics({ link }: { link: PaymentLink | undefined }) {
  const { currentAccount } = useAccountAtom();

  const data = link?.intents?.filter((i) => i.status === "succeeded");

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Performance</h1>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <span className="w-fit text-xs uppercase">
                {currentAccount?.country.currency.code}
              </span>
            </CardHeader>
            <CardContent>
              <div className="font-bold md:text-2xl">
                {numberFormat(
                  getAmount(data ?? []),
                  currentAccount?.country.currency.code,
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Month</CardTitle>
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="font-bold md:text-2xl">
                {numberFormat(
                  getAmountForTheMonth(data ?? []),
                  currentAccount?.country.currency.code,
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Week</CardTitle>
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="font-bold md:text-2xl">
                {numberFormat(
                  getAmountForCurrentWeek(data ?? []),
                  currentAccount?.country.currency.code,
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Day</CardTitle>
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="font-bold md:text-2xl">
                {numberFormat(
                  getAmountForToday(data ?? []),
                  currentAccount?.country.currency.code,
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="pt-10">
        <h1 className="text-xl font-bold">Recent payments</h1>
        <Separator className="my-4" />
        <IntentDataTable
          columns={intentColumns}
          data={(link?.intents as any) ?? []}
        />
      </div>
    </div>
  );
}

export default Analytics;
