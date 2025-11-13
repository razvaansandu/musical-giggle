
import SpotifyHeader from "@/components/SpotifyHeader"; 
export default function RootLayout({ children }) {
  return (
    <div> 
      <SpotifyHeader> </SpotifyHeader>
        {children} 
      
    </div> 
  );
}
