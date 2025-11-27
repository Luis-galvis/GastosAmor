import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Income {
    id: string;
    month_id: string;
    description: string;
    amount: number;
    created_at: string;
}

export const useIncomes = (monthId: string | undefined) => {
    return useQuery({
        queryKey: ["incomes", monthId],
        queryFn: async () => {
            if (!monthId) return [];

            const { data, error } = await supabase
                .from("incomes" as any)
                .select("*")
                .eq("month_id", monthId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Income[];
        },
        enabled: !!monthId,
    });
};

export const useAddIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (income: { month_id: string; description: string; amount: number }) => {
            const { data, error } = await supabase
                .from("incomes" as any)
                .insert(income)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["incomes"] });
            toast.success("¡Ingreso agregado mi amor! 💰✨");
        },
        onError: () => {
            toast.error("Error al agregar ingreso mi princesa 😢");
        },
    });
};

export const useDeleteIncome = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (incomeId: string) => {
            const { error } = await supabase
                .from("incomes" as any)
                .delete()
                .eq("id", incomeId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["incomes"] });
            toast.success("Ingreso eliminado mi niña 🗑️");
        },
        onError: () => {
            toast.error("Error al eliminar ingreso 😢");
        },
    });
};
