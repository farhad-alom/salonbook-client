import TransactionList from "@/components/TransactionList";

export default function AdminTransactionsPage() {
    return <TransactionList apiPath="/api/admin/transactions" title="Transactions" showCustomer={true} />;
}