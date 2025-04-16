"use client";

import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function Home() {
    const accountsQuery = useGetAccounts();
    const { onOpen } = useNewAccount();

    if (accountsQuery.isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>
            <Button onClick={onOpen}>Add</Button>
                <div>
            {accountsQuery.data?.map((account) => (
                <div key={account.id}>
                    {account.name}
                </div>
            ))}
        </div>
        </>

    )
}