-- Create daily tasks tracking table
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_type TEXT NOT NULL, -- 'dex_swap' or 'daily_checkin'
  project_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  streak_count INTEGER NOT NULL DEFAULT 1,
  verification_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own daily tasks" 
ON public.daily_tasks 
FOR SELECT 
USING (user_id = (auth.jwt() ->> 'wallet_address') OR user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'));

CREATE POLICY "Users can create their own daily tasks" 
ON public.daily_tasks 
FOR INSERT 
WITH CHECK (user_id = (auth.jwt() ->> 'wallet_address') OR user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create daily progress tracking table for badge eligibility
CREATE TABLE public.daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  total_completions INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_completion_date DATE,
  badge_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Enable RLS for daily progress
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily progress" 
ON public.daily_progress 
FOR SELECT 
USING (user_id = (auth.jwt() ->> 'wallet_address') OR user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'));

CREATE POLICY "Users can manage their own daily progress" 
ON public.daily_progress 
FOR ALL 
USING (user_id = (auth.jwt() ->> 'wallet_address') OR user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'));

-- Add indexes for performance
CREATE INDEX idx_daily_tasks_user_date ON public.daily_tasks(user_id, DATE(completed_at));
CREATE INDEX idx_daily_progress_user ON public.daily_progress(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_daily_progress_updated_at
BEFORE UPDATE ON public.daily_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();