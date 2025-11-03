import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./SchermatePrincipali/loginPage.jsx";
import Home from "./SchermatePrincipali/home.jsx"; 
import ButtonNextSong from "../components/buttons/buttonNextSong.jsx";   
import ButtonPrevSong from "../components/buttons/songButtonFirst.jsx";    
import ButtonHome from "../components/buttons/buttonHome.jsx";  
import ButtonShuffle from "../components/buttons/buttonShuffle.jsx";  
import ButtonNews from "../components/buttons/buttonNews.jsx";  
import ButtonAddToPlaylist from "../components/buttons/ButtonAddToPlaylist.jsx";   
import SearchBar from "../components/buttons/SearchBar.jsx"; 
import ButtonSettings from "../components/buttons/ButtonSettings.jsx"; 
function App() {   
  return (    
  
    <>   
    <ButtonSettings> </ButtonSettings>
      <SearchBar> </SearchBar>   
    <ButtonAddToPlaylist> </ButtonAddToPlaylist>
    <ButtonNews> </ButtonNews>  
    <ButtonShuffle>  </ButtonShuffle>
    <ButtonHome> </ButtonHome>  
      <ButtonPrevSong> </ButtonPrevSong>   
     <ButtonNextSong> </ButtonNextSong>  
     <Login> </Login>
    
     </>  
  );  
} 

export default App;
 