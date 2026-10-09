import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import type {Session} from '@supabase/supabase-js';
import {BookOpen,Mail,Cloud} from 'lucide-react';
import {cloud} from './cloud';
import Study from './StudyBoard';
import './styles.css';
function App(){
const [session,setSession]=useState<Session|null>(null);const [checking,setChecking]=useState(!!cloud);const [email,setEmail]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
useEffect(()=>{if(!cloud)return;cloud.auth.getSession().then(({data})=>{setSession(data.session);setChecking(false);});const {data}=cloud.auth.onAuthStateChange((_event,s)=>{setSession(s);setChecking(false);});return ()=>data.subscription.unsubscribe();},[]);
if(session)return <Study key={session.user.id} onSignOut={async()=>{await cloud!.auth.signOut();}}/>;
return <div className="login-page"><section className="login-card"><div className="brand"><span className="brand-mark"><BookOpen size={24}/></span><span>向前<small>考研学习计划</small></span></div><h1>今天，也向前一步。</h1><p>登录同一账户，在手机和电脑上接着学。</p>{!cloud?<div className="setup-notice"><Cloud size={23}/><h2>云端同步正在配置</h2><p>前端已准备就绪。接入云数据库后，即可登录并同步任务与学习记录。</p></div>:checking?<p role="status">正在恢复登录…</p>:<form onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage('');try{const redirect=new URL('.',window.location.href).href;const {error}=await cloud!.auth.signInWithOtp({email,options:{emailRedirectTo:redirect}});if(error)throw error;setMessage('登录邮件已发送，请在这台设备上打开邮件中的链接。');}catch{setMessage('发送失败，请稍后重试或检查邮箱地址。');}finally{setBusy(false);}}}><label>邮箱地址<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="你的常用邮箱"/></label><button className="primary" disabled={busy}><Mail size={17}/>{busy?'发送中…':'发送登录链接'}</button><p role="status" className="quiet">{message}</p></form>}<p className="login-foot">学习数据按账户保存，仅自己可见。</p></section></div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);


