"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge/Badge";
import { Building2, Upload } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const organizationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export default function OrganizationSettingsPage() {
  const { currentOrganization } = useAccountAtom();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-organization"],
    mutationFn: async (values: OrganizationFormValues) => {
      // TODO: Implement organization update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      toast.success("Organization updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update organization");
    },
  });

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: currentOrganization?.name || "",
      description: currentOrganization?.description || "",
      logoUrl: currentOrganization?.logoUrl || "",
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement logo upload logic
      const imageUrl = URL.createObjectURL(file);
      form.setValue("logoUrl", imageUrl);
    }
  };

  function onSubmit(values: OrganizationFormValues) {
    mutate(values);
  }

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Organization Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your organization profile and settings
          </p>
        </div>
        <Badge intent="secondary" className="px-3 py-1">
          {currentOrganization?.subscriptions?.[0]?.status || "No Subscription"}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logo">Organization Logo</Label>
                <div className="flex items-start space-x-4">
                  <div className="bg-muted relative h-24 w-24 overflow-hidden rounded-lg border">
                    {form.watch("logoUrl") ? (
                      <Image
                        src={form.watch("logoUrl")}
                        alt="Organization logo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2 className="text-muted-foreground h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        className="relative"
                        size="sm"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          className="absolute inset-0 cursor-pointer opacity-0"
                          onChange={handleLogoUpload}
                        />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Recommended size: 256x256px. Max file size: 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief description of your organization"
                        rows={4}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Organization ID</Label>
                <p className="text-muted-foreground text-sm">
                  {currentOrganization?.id}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Created At</Label>
                <p className="text-muted-foreground text-sm">
                  {new Date(
                    currentOrganization?.createdAt || "",
                  ).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Information</CardTitle>
              <CardDescription>
                View your current subscription status and plan details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentOrganization?.activeSubscription ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-muted-foreground text-sm">
                          {currentOrganization.activeSubscription.plan.name}
                        </p>
                      </div>
                      <Badge
                        intent={
                          currentOrganization.activeSubscription.status ===
                          "active"
                            ? "success"
                            : "warning"
                        }
                      >
                        {currentOrganization.activeSubscription.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Subscription Period</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(
                          currentOrganization.activeSubscription.startDate,
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          currentOrganization.activeSubscription.endDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      No active subscription
                    </p>
                    <Button className="mt-4" variant="outline">
                      View Plans
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
