-- Create incomes table to track additional income during the month
CREATE TABLE public.incomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_id UUID NOT NULL REFERENCES public.months(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (but allow public access for simplicity - no auth needed)
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

-- Public policy (no login required for this simple app)
CREATE POLICY "Allow all access to incomes" ON public.incomes FOR ALL USING (true) WITH CHECK (true);
