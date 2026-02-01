-- Rename table and add video-specific columns
ALTER TABLE public.avatars RENAME TO videos;

-- Add duration column for tracking video length
ALTER TABLE public.videos 
ADD COLUMN duration_seconds INTEGER DEFAULT 5,
ADD COLUMN video_type TEXT DEFAULT 'avatar';

-- Update RLS policies with new table name
DROP POLICY IF EXISTS "Users can create their own avatars" ON public.videos;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON public.videos;
DROP POLICY IF EXISTS "Users can view their own avatars" ON public.videos;

CREATE POLICY "Users can create their own videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
ON public.videos 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own videos" 
ON public.videos 
FOR SELECT 
USING (auth.uid() = user_id);

-- Rename column image_url to video_url
ALTER TABLE public.videos RENAME COLUMN image_url TO video_url;

-- Update profiles table: rename avatar_count to video_count
ALTER TABLE public.profiles RENAME COLUMN avatar_count TO video_count;