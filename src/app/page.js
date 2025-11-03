import Image from "next/image";
import styles from "./page.module.css";
import LikeButton from '../components/buttons/LikeButton';
import PlayButton from '../components/buttons/PlayButton';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/spo1.png"
          width={330} 
          height={330}
          priority
        />
        <div className={styles.intro}>
          <h1>To get startead, edit the page.js file.</h1>
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div>
          <LikeButton/>
          <PlayButton/>
        </div>
      </main>
    </div>
  );
}
