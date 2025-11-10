import SpotifyControls from "./buttons/LikeButton";
import "./miniCard.css";   

function MiniCard(props){
  const title=props.title; 
    const description=props.description; 
    const imageUrl=props.imageUrl; 
    const numOfViews=props.numOfViews; 
    const numOfTime=props.time;  
  return (  

    <div className="card"> 
    <img src={imageUrl} alt={title} className="card-image" /> 
    &nbsp; 
     <h2 className="card-title">{title}</h2> 
     <SpotifyControls />
    </div>  
  ); 
}
export default MiniCard;     