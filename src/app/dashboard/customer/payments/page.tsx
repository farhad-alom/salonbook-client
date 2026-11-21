import TransactionList from "@/components/TransactionList";

export default function CustomerPaymentsPage() {
    return <TransactionList apiPath="/api/transactions" title="Payment History" showCustomer={false} />;
}