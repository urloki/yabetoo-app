"use client";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {z} from "zod";

import {AutoForm, fieldConfig} from "@/components/ui/autoform";
import {Icons} from "@/components/icons";
import {toast} from "sonner";
import {useTransition} from "react";
import {signOut} from "next-auth/react";
import {ZodProvider} from "@autoform/zod";
import {changePassword} from "@/src/actions/account/change-password.action";

function ChangePasswordDialog() {
    const [isPending, startTransition] = useTransition();

    const formSchema = z
        .object({
            oldPassword: z.string().superRefine(
                fieldConfig({
                    inputProps: {
                        type: "password",
                    },
                })
            ),
            newPassword: z
                .string()
                .min(6)
                .max(6)
                .describe("Only digits are allowed")
                .refine(
                    (v) => {
                        // must contain only numbers
                        return /^\d+$/.test(v);
                    },
                    {
                        message: "Password must contain only numbers",
                    },
                ).superRefine(
                    fieldConfig({
                        inputProps: {
                            type: "password",
                        },
                    })
                ),
            confirmPassword: z.string().min(6).max(6).superRefine(
                fieldConfig({
                    inputProps: {
                        type: "password",
                    },
                })
            ),
        })
        .superRefine(({newPassword, confirmPassword}, ctx) => {
            if (newPassword !== confirmPassword) {
                return ctx.addIssue({
                    code: "custom",
                    message: "Passwords do not match",
                    path: ["confirmPassword"],
                });
            }
        });

    const schemaProvider = new ZodProvider(formSchema);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        startTransition(() => {
            changePassword(data).then(async (r) => {
                console.log(r);
                if (r.error) {
                    toast.error(r.error);
                    return;
                }
                toast.success("Password changed successfully");
                await signOut();
            });
        });
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Change password </DialogTitle>
                <DialogDescription>
                    Please enter your old password and new password to change your
                </DialogDescription>
            </DialogHeader>
            <div>
                <AutoForm
                    schema={schemaProvider}
                    onSubmit={onSubmit}
                >
                    <DialogFooter>
                        <Button>
                            {isPending && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Continue
                        </Button>
                    </DialogFooter>
                </AutoForm>
            </div>
        </DialogContent>
    );
}

export default ChangePasswordDialog;
