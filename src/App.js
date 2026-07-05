import {useState} from 'react';
import WhoScreen from './screens/WhoScreen';
import HubScreen from './screens/HubScreen';
import QuizApp from './screens/QuizApp';
import FlagQuiz from './screens/FlagQuiz';
import MathTables from './screens/MathTables';

export default function App(){
  const[screen,setScreen]=useState('who');
  const[profile,setProfile]=useState(null);
  const[avatarIdx,setAvatarIdx]=useState(0);

  function handleLogin(p,av){setProfile(p);setAvatarIdx(av);setScreen('hub');}
  function handleSwitchPlayer(){setProfile(null);setAvatarIdx(0);setScreen('who');}

  if(screen==='who')return <WhoScreen onLogin={handleLogin}/>;
  if(screen==='hub')return <HubScreen profile={profile} avatarIdx={avatarIdx} onPickApp={setScreen} onSwitchPlayer={handleSwitchPlayer}/>;
  if(screen==='quiz')return <QuizApp key={profile?.id} profile={profile} avatarIdx={avatarIdx} onBack={()=>setScreen('hub')} onSwitchPlayer={handleSwitchPlayer}/>;
  if(screen==='flags')return <FlagQuiz profile={profile} avatarIdx={avatarIdx} onBack={()=>setScreen('hub')} onSwitchPlayer={handleSwitchPlayer}/>;
  if(screen==='math')return <MathTables profile={profile} avatarIdx={avatarIdx} onBack={()=>setScreen('hub')} onSwitchPlayer={handleSwitchPlayer}/>;
  return null;
}
