import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Expense {
  id: string;
  month_id: string;
  description: string;
  amount: number;
  category: string;
  created_at: string;
}

export const useExpenses = (monthId: string | undefined) => {
  return useQuery({
    queryKey: ["expenses", monthId],
    queryFn: async () => {
      if (!monthId) return [];
      
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("month_id", monthId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!monthId,
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: { month_id: string; description: string; amount: number; category: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert(expense)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("¡Gasto agregado! 📝");
    },
    onError: () => {
      toast.error("Error al agregar gasto");
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Gasto eliminado 🗑️");
    },
    onError: () => {
      toast.error("Error al eliminar gasto");
    },
  });
};
