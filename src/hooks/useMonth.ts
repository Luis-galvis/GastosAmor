import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Month {
  id: string;
  salary: number;
  is_active: boolean;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export const useActiveMonth = () => {
  return useQuery({
    queryKey: ["active-month"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("months")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();
      
      if (error) throw error;
      return data as Month | null;
    },
  });
};

export const useStartMonth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (salary: number) => {
      // First, end any active month
      await supabase
        .from("months")
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq("is_active", true);
      
      // Create new month
      const { data, error } = await supabase
        .from("months")
        .insert({ salary, is_active: true })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-month"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("¡Mes iniciado! 🎀");
    },
    onError: () => {
      toast.error("Error al iniciar el mes");
    },
  });
};

export const useEndMonth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (monthId: string) => {
      const { error } = await supabase
        .from("months")
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq("id", monthId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-month"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("¡Mes finalizado! 💕");
    },
    onError: () => {
      toast.error("Error al finalizar el mes");
    },
  });
};
