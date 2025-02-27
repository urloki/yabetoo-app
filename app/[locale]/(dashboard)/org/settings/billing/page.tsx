"use client";

import { useAccountAtom } from "@/src/atoms/account.atom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function BillingPage() {
  const { currentOrganization } = useAccountAtom();
  const activeSubscription = currentOrganization?.activeSubscription;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(Number(amount));
  };

  // Group commissions by key
  const groupCommissionsByKey = (commissions: any[]) => {
    return commissions.reduce((groups, commission) => {
      const key = commission.key;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(commission);
      return groups;
    }, {});
  };

  const customCommissionGroups = activeSubscription
    ? groupCommissionsByKey(activeSubscription.customCommissions)
    : {};

  const standardCommissionGroups = activeSubscription
    ? groupCommissionsByKey(activeSubscription.plan.commissions)
    : {};

  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>
        {activeSubscription && (
          <Badge
            intent={
              activeSubscription.status === "active" ? "success" : "warning"
            }
            className="px-3 py-1"
          >
            {activeSubscription.status}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your current subscription plan and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSubscription ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold">
                    {activeSubscription.plan.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {activeSubscription.plan.description}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Base Price</span>
                    <span className="font-semibold">
                      {formatCurrency(activeSubscription.plan.basePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Billing Period</span>
                    <span className="text-sm">
                      {new Date(
                        activeSubscription.startDate,
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        activeSubscription.endDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Change Plan
                </Button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  No active subscription
                </p>
                <Button variant="default">View Plans</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {activeSubscription &&
          Object.keys(customCommissionGroups).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Commissions</CardTitle>
                <CardDescription>
                  Your custom commission rates for different operators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(customCommissionGroups).map(
                  ([key, commissions]) => (
                    <Collapsible
                      key={key}
                      open={openGroups[key]}
                      onOpenChange={() => toggleGroup(key)}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 font-medium">
                        <div className="flex items-center gap-2">
                          {openGroups[key] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="capitalize">{key}</span>
                        </div>
                        <Badge intent="secondary" className="ml-auto">
                          {(commissions as any[]).length} operators
                        </Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Operator</TableHead>
                              <TableHead>Rate</TableHead>
                              <TableHead>Fixed Fee</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(commissions as any[]).map((commission) => (
                              <TableRow key={commission.id}>
                                <TableCell className="font-medium">
                                  {commission.operatorName}
                                </TableCell>
                                <TableCell>{commission.rate}%</TableCell>
                                <TableCell>
                                  {formatCurrency(commission.fixedFee)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CollapsibleContent>
                    </Collapsible>
                  ),
                )}
              </CardContent>
            </Card>
          )}
      </div>

      {activeSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>
              Features included in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeSubscription.plan.features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start space-x-3 rounded-lg border p-4"
                >
                  {feature.isIncluded ? (
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  ) : (
                    <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{feature.feature.key}</p>
                    <p className="text-muted-foreground text-sm">
                      {feature.feature.description}
                    </p>
                    {feature.maxNumber > 0 && (
                      <p className="mt-1 text-sm font-medium">
                        Limit: {feature.maxNumber}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeSubscription &&
        activeSubscription?.plan.commissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Standard Commission Rates</CardTitle>
              <CardDescription>
                Default commission rates for your plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(standardCommissionGroups).map(
                ([key, commissions]) => (
                  <Collapsible
                    key={key}
                    open={openGroups[`standard_${key}`]}
                    onOpenChange={() => toggleGroup(`standard_${key}`)}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 font-medium">
                      <div className="flex items-center gap-2">
                        {openGroups[`standard_${key}`] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="capitalize">{key}</span>
                      </div>
                      <Badge intent="secondary" className="ml-auto">
                        {(commissions as any[]).length} operators
                      </Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Operator</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Fixed Fee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(commissions as any[]).map((commission) => (
                            <TableRow key={commission.id}>
                              <TableCell className="font-medium">
                                {commission.operatorName}
                              </TableCell>
                              <TableCell className="capitalize">
                                {commission.category}
                              </TableCell>
                              <TableCell>{commission.rate}%</TableCell>
                              <TableCell>
                                {formatCurrency(commission.fixedFee)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                ),
              )}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
