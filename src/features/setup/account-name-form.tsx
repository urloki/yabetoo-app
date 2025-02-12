import React from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const accountNameFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
});

function AccountNameForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof accountNameFormSchema>>;
}) {
  return (
    <div className="mb-10 pt-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <Label htmlFor="name">Nom de la boutique</Label>
                <Input
                  id="name"
                  className="mt-4"
                  placeholder="Saisir un nom.."
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/*<StepperFormActions />*/}
    </div>
  );
}

export default AccountNameForm;
