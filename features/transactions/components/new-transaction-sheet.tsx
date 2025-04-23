import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { useCreateTransaction } from "../api/use-create-transaction";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";


const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

  const categoryMutation = useCreateCategory();
  const categoriesQuery = useGetCategories();
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name,
  });
  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }));

  const accountMutation = useCreateAccount();
  const accountsQuery = useGetAccounts();
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name,
  });
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  const isPending = 
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;
  
  const isLoading =
    categoriesQuery.isLoading ||
    accountsQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Transaction
          </SheetTitle>
          <SheetDescription>
            Add a new transaction
          </SheetDescription>
        </SheetHeader>
        {isLoading ? 
        (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
          </div>

        )
        : (
          <div className="mx-4">
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              onCreateAccount={onCreateAccount}
              accountOptions={accountOptions}
              onCreateCategory={onCreateCategory}
              categoryOptions={categoryOptions}
            />
          </div>
        ) }

      </SheetContent>
    </Sheet>
  )
}