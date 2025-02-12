import React from "react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

export const changePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(6).max(6),
    newPassword: z.string().min(6).max(6),
    confirmPassword: z.string().min(6).max(6),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
      });
    }
    if (!/^\d+$/.test(newPassword)) {
      ctx.addIssue({
        code: "custom",
        message: "Le mot de passe ne doit contenir que des chiffres",
        path: ["newPassword"],
      });
    }
  });

function ChangePasswordForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof changePasswordFormSchema>>;
}) {
  return (
    <div className="mb-10">
      <div className="flex flex-col gap-4 py-10">
        <p
          className={cn(
            "text-sm",
            form.watch("newPassword").length === 6
              ? "text-green-600"
              : "text-red-600",
          )}
        >
          <CircleCheck className="mr-2 inline-block h-6 w-6" />
          Votre mot de passe contient 6 caractères.
        </p>
        <p
          className={cn(
            "text-sm",
            /^\d+$/.test(form.watch("newPassword"))
              ? "text-green-600"
              : "text-red-600",
          )}
        >
          <CircleCheck className="mr-2 inline-block h-6 w-6" />
          Votre mot de passe contient que des chiffres.
        </p>
      </div>
      <div className="flex flex-col gap-7">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entrez votre mot de passe actuel</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ancien mot de passe.."
                  type="password"
                  maxLength={6}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("oldPassword").length === 6 && (
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrez votre nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nouveau mot de passe.."
                    maxLength={6}
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch("newPassword").length === 6 && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmez votre nouveau mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirmer le mot de passe.."
                    type="password"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default ChangePasswordForm;
