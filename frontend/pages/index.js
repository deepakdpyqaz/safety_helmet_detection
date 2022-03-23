import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Link from 'next/link'
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Safety Helmet Detection</title>
        <meta name="description" content="Safety Helmet Detection using tiny-yolov4" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Safety Helmet <a href="#">Detection</a> {' '}
          <img src="/helmet.png" width={50} height={50} />
        </h1>

        <p className={styles.description}>
          Created Using {' '}
          <code className={styles.code}>tiny-yolov4</code>
        </p>

        <div>
          <Link href="/detection">
          <Button variant="contained" size="large" endIcon={<TravelExploreIcon/>}>
            Detect
          </Button>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/deepakdpyqaz/safety_helmet_detection"
          target="_blank"
          rel="noopener noreferrer"
        >
          View complete code on Github {' '} <GitHubIcon/>
        </a>
      </footer>
    </div>
  )
}
