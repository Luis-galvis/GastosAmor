import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Debt {
    id: string;
    description: string;
    total_amount: number;
    is_paid: boolean;
    created_at: string;
}

export interface DebtPayment {
    id: string;
    debt_id: string;
    amount: number;
    date: string;
    created_at: string;
}

export const useDebts = () => {
    return useQuery({
        queryKey: ["debts"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("debts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Debt[];
        },
    });
};

export const useDebtPayments = (debtId: string) => {
    return useQuery({
        queryKey: ["debt_payments", debtId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("debt_payments")
                .select("*")
                .eq("debt_id", debtId)
                .order("date", { ascending: false });

            if (error) throw error;
            return data as DebtPayment[];
        },
        enabled: !!debtId,
    });
};

export const useAddDebt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newDebt: { description: string; total_amount: number }) => {
            const { data, error } = await supabase
                .from("debts")
                .insert([newDebt])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["debts"] });
            toast.success("Deuda agregada mi amor 💸");
        },
        onError: (error) => {
            console.error("Error adding debt:", error);
            toast.error("No se pudo agregar la deuda 😢");
        },
    });
};

export const useAddDebtPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payment: { debt_id: string; amount: number }) => {
            const { data, error } = await supabase
                .from("debt_payments")
                .insert([{
                    debt_id: payment.debt_id,
                    amount: payment.amount,
                    date: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["debt_payments", variables.debt_id] });
            queryClient.invalidateQueries({ queryKey: ["debts"] }); // To update status if needed
            toast.success("Abono registrado mi vida 💖");
        },
        onError: (error) => {
            console.error("Error adding payment:", error);
            toast.error("No se pudo registrar el abono 😢");
        },
    });
};

export const useUpdateDebtStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, is_paid }: { id: string; is_paid: boolean }) => {
            const { data, error } = await supabase
                .from("debts")
                .update({ is_paid })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["debts"] });
        },
    });
};
