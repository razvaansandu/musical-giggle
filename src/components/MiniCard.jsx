import SpotifyControls from "./buttons/LikeButton";
import ButtonShuffle from "./buttons/buttonShuffle";
import ButtonPrevSong from "./buttons/songButtonFirst";
import ButtonNextSong from "./buttons/buttonNextSong";
import PlayButton from "./buttons/PlayButton";
import PlaybackProgress from "./PlaybackProgress";
import ButtonDispositivi from "./buttons/buttonDispositivi";
import ButtonLoop from "./buttons/ButtonLoop";
import "./miniCard.css";
import  VolumeButton  from "./volume/Volume";

function MiniCard(props){
  const title = props.title;
  const description = props.description;
  const imageUrl = props.imageUrl;
  const numOfViews = props.numOfViews;
  const duration = props.time ;

  return (
    <div className="card"> 
      <img src={imageUrl} alt={title} className="card-image" />

      <div className="card-content">
        <h2 className="card-title center-title">{title}</h2>

        <div className="controls-row">
          <ButtonShuffle />
          <ButtonPrevSong />
          <PlayButton />
          <ButtonNextSong /> 
          <ButtonLoop/>
            <ButtonDispositivi />
        </div> 
 
        <div className="progress-row">
          <PlaybackProgress duration={100} />
        </div> 
      </div>

      
      <div className="button">
        <div>
        
        <VolumeButton />
        <SpotifyControls />
        
</div> 
      </div>
  
    </div>
    
  );
} 
 
export default MiniCard;