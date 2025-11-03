import "./Card.css";    

function Card(props){
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
     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
      <p>{numOfViews}</p> 
      &nbsp; 
      <p>{numOfTime}</p> 
      <div className="card-content"> 
      
      </div> 
    </div>  
  ); 
}
export default Card;   