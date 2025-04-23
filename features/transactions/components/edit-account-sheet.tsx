import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetTransaction } from "../api/use-get-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { TransactionForm } from "./transaction-form";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this transaction."
  )
  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

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
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;
  
  const isLoading = 
    transactionQuery.isLoading ||
    categoriesQuery.isLoading ||
    accountsQuery.isLoading;
    

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  }

  const defaultValues = transactionQuery.data ? {
    accountId: transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId,
    amount: transactionQuery.data.amount?.toString(),
    date: transactionQuery.data.date
      ? new Date(transactionQuery.data.date)
      : new Date(),
    payee: transactionQuery.data.payee
  } : undefined;

  return (
    <>
    <ConfirmationDialog />
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Edit Transaction
          </SheetTitle>
          <SheetDescription>
            Edit an existing transaction
          </SheetDescription>
        </SheetHeader>
        {
          isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate"/>
            </div>
          ) : (
            <div className="mx-4">
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              disabled={isPending}
              onSubmit={onSubmit}
              onDelete={onDelete}
              onCreateAccount={onCreateAccount}
              accountOptions={accountOptions}
              onCreateCategory={onCreateCategory}
              categoryOptions={categoryOptions}
            />
          </div>
          )
        }
      </SheetContent>
    </Sheet>
    </>
  )
}