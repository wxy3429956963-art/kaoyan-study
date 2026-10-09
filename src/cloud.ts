import { createClient } from '@supabase/supabase-js';
import { initialSettings } from './study.mjs';
import publicConfig from './supabase-config.json';
const url=import.meta.env.VITE_SUPABASE_URL||publicConfig.url;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||publicConfig.publishableKey;
export const cloud=url&&key?createClient(url,key):null;
export type StudyTask={id:string;date:string;subject:string;title:string;planned:number;done:boolean};
export type StudySession={id:string;date:string;subject:string;minutes:number};
export type StudySettings={startDate:string;examDate:string;dailyGoal:number};
export type StudyData={settings:StudySettings;tasks:StudyTask[];sessions:StudySession[]};
function client(){if(!cloud)throw new Error('云数据库尚未配置。');return cloud;}
async function owner(){const {data,error}=await client().auth.getUser();if(error||!data.user)throw new Error('请登录后查看学习记录。');return data.user.id;}
export async function loadStudy():Promise<StudyData>{
const uid=await owner();const c=client();
const [settings,tasks,sessions]=await Promise.all([c.from('study_settings').select('start_date,exam_date,daily_goal').eq('user_id',uid).maybeSingle(),c.from('study_tasks').select('id,date,subject,title,planned,done').eq('user_id',uid),c.from('study_sessions').select('id,date,subject,minutes').eq('user_id',uid).order('date',{ascending:false})]);
if(settings.error||tasks.error||sessions.error)throw new Error('云端记录无法加载，请检查网络或稍后重试。');
return {settings:settings.data?{startDate:settings.data.start_date,examDate:settings.data.exam_date,dailyGoal:settings.data.daily_goal}:initialSettings,tasks:tasks.data??[],sessions:sessions.data??[]};
}
type Action={action:'settings';settings:StudySettings}|{action:'task';task:StudyTask}|{action:'session';session:StudySession}|{action:'deleteSession';id:string};
export async function saveStudy(payload:unknown){
const p=payload as Action;const uid=await owner();const c=client();let error;
if(p.action==='settings'){({error}=await c.from('study_settings').upsert({user_id:uid,start_date:p.settings.startDate,exam_date:p.settings.examDate,daily_goal:p.settings.dailyGoal},{onConflict:'user_id'}));}
else if(p.action==='task'){({error}=await c.from('study_tasks').upsert({...p.task,user_id:uid},{onConflict:'user_id,id'}));}
else if(p.action==='session'){({error}=await c.from('study_sessions').upsert({...p.session,user_id:uid},{onConflict:'user_id,id',ignoreDuplicates:true}));}
else if(p.action==='deleteSession'){({error}=await c.from('study_sessions').delete().eq('user_id',uid).eq('id',p.id));}
else throw new Error('操作无效。');
if(error)throw new Error('保存失败，输入已保留，请重试。');
}
