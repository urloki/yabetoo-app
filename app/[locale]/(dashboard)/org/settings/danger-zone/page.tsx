"use client";

import { useState } from "react";
import { useAccountAtom } from "@/src/atoms/account.atom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge/Badge";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function DangerZonePage() {
  const { currentOrganization } = useAccountAtom();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "deactivate" | "delete" | "transfer" | null
  >(null);
  const [confirmText, setConfirmText] = useState("");

  const dangerousActions = [
    {
      title: "Deactivate Organization",
      description:
        "Temporarily disable your organization. All members will lose access until reactivated.",
      buttonText: "Deactivate",
      type: "deactivate" as const,
      confirmPhrase: currentOrganization?.name,
      intent: "warning" as const,
    },
    {
      title: "Transfer Ownership",
      description:
        "Transfer ownership of this organization to another member. This action cannot be undone.",
      buttonText: "Transfer",
      type: "transfer" as const,
      confirmPhrase: "transfer ownership",
      intent: "warning" as const,
    },
    {
      title: "Delete Organization",
      description:
        "Permanently delete your organization and all of its data. This action cannot be undone.",
      buttonText: "Delete",
      type: "delete" as const,
      confirmPhrase: "delete organization",
      intent: "destructive" as const,
    },
  ];

  const handleAction = async () => {
    const action = dangerousActions.find((a) => a.type === actionType);
    if (!action) return;

    if (confirmText !== action.confirmPhrase) {
      toast.error("Confirmation text does not match");
      return;
    }

    try {
      // TODO: Implement the actual action
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Organization ${action.type} action initiated`);
      setIsConfirmDialogOpen(false);
      setConfirmText("");
      setActionType(null);
    } catch (error) {
      toast.error(`Failed to ${action.type} organization`);
      console.error(error);
    }
  };

  const openConfirmDialog = (type: typeof actionType) => {
    setActionType(type);
    setIsConfirmDialogOpen(true);
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Danger Zone</h2>
          <p className="text-muted-foreground">
            Critical actions that affect your organization
          </p>
        </div>
        <Badge intent="danger" className="px-3 py-1">
          Critical Settings
        </Badge>
      </div>

      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription>
            These actions can have serious consequences. Please proceed with
            caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dangerousActions.map((action) => (
            <div
              key={action.type}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{action.title}</p>
                <p className="text-muted-foreground text-sm">
                  {action.description}
                </p>
              </div>
              <Button
                variant={
                  action.intent === "destructive" ? "destructive" : "outline"
                }
                onClick={() => openConfirmDialog(action.type)}
              >
                {action.buttonText}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dangerousActions.find((a) => a.type === actionType)?.title}
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type{" "}
              <span className="font-medium">
                &quot;
                {
                  dangerousActions.find((a) => a.type === actionType)
                    ?.confirmPhrase
                }
                &quot;
              </span>{" "}
              to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Confirmation</Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type the confirmation text"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleAction}
              disabled={
                confirmText !==
                dangerousActions.find((a) => a.type === actionType)
                  ?.confirmPhrase
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
