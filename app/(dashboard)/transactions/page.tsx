"use client";

import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { transactions as transactionsSchema} from "@/db/schema";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/bulk-delete";
import { Suspense, useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { useSelectAccount } from "@/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
};

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};


const TransactionsInnerPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const newTransaction = useNewTransaction();
  const deleteTransactions = useBulkDeleteTransactions();
  const createTransactions = useBulkCreateTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data;


  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;
  
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  }

  const onSubmitImport = async (
    values: typeof transactionsSchema.$inferInsert[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account")
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    });
  }

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
         <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48"/>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin"/>
            </div>
          </CardContent>
         </Card>
      </div>
    )
  }


  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard 
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }
  
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:flex
          lg:items-center lg:justify-between
        ">
          <CardTitle className="text-xl line-clamp-1">
            Transactions Page
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
            <Button 
              className="w-full lg:w-auto"
              size="sm" 
              onClick={newTransaction.onOpen}>
              <Plus className="size-4" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>

        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // TODO: Fix this
            data={transactions} 
            filterKey="payee"
            onDelete={(row) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // TODO: Fix this
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>

      </Card>
    </div>
  )
};

const TransactionsPage = () => {
  return (
    <Suspense fallback={
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48"/>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin"/>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <TransactionsInnerPage />
    </Suspense>
  );
}

export default TransactionsPage;
