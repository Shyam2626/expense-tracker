-- Create income_categories table for different types of income
CREATE TABLE public.income_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rename monthly_salaries to monthly_income and add category support
CREATE TABLE public.monthly_income (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  income_category_id UUID NOT NULL REFERENCES public.income_categories(id),
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly_carryover table to store month-to-month carry over
CREATE TABLE public.monthly_carryover (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month)
);

-- Enable RLS
ALTER TABLE public.income_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_carryover ENABLE ROW LEVEL SECURITY;

-- RLS Policies for income_categories
CREATE POLICY "Users can view their own income categories" ON public.income_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own income categories" ON public.income_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own income categories" ON public.income_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own income categories" ON public.income_categories FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for monthly_income
CREATE POLICY "Users can view their own income" ON public.monthly_income FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own income" ON public.monthly_income FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own income" ON public.monthly_income FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own income" ON public.monthly_income FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for monthly_carryover
CREATE POLICY "Users can view their own carryover" ON public.monthly_carryover FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own carryover" ON public.monthly_carryover FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own carryover" ON public.monthly_carryover FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own carryover" ON public.monthly_carryover FOR DELETE USING (auth.uid() = user_id);

-- Migrate existing salary data to monthly_income
-- First, create a default "Salary" income category for each user
INSERT INTO public.income_categories (user_id, name)
SELECT DISTINCT user_id, 'Salary'
FROM public.monthly_salaries;

-- Then migrate the salary data
INSERT INTO public.monthly_income (user_id, year, month, income_category_id, amount, created_at)
SELECT 
  ms.user_id, 
  ms.year, 
  ms.month, 
  ic.id as income_category_id,
  ms.amount,
  ms.created_at
FROM public.monthly_salaries ms
JOIN public.income_categories ic ON ic.user_id = ms.user_id AND ic.name = 'Salary';

-- Note: We're keeping monthly_salaries table for now to maintain backward compatibility
-- The old table can be dropped manually later after confirming migration success

