"use client";

import { Button } from "@/components/ui/button";
import { 
  Card,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";



const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:flex
          lg:items-center lg:justify-between
        ">
          <CardTitle className="text-xl line-clamp-1">
            Transactions Page
          </CardTitle>
          <Button size="sm" onClick={newTransaction.onOpen}>
            <Plus className="size-4" />
            Add new
          </Button>
        </CardHeader>

      </Card>
    </div>
  )
};

export default TransactionsPage;
