import Head from "next/head"
import styles from "@/styles/Home.module.css"
import Link from 'next/link'
import useUser from "@/lib/useUser"



export default function Home() {
  const { user } = useUser();

  return (
    <div className="container">
      <Head>
        <title>UnMute</title>
        <link rel="icon" href="unMuteIcon.ico" />
      </Head>

      <main>
      <img src="/unMutelogo/unMuteIconTransparent.png" alt="UnMute Icon"></img>
       
        <h1 class ="frontPageh1">
          
          Welcome to unMute {user ? user.name : '!'}
      
          </h1>

        <div className="grid">
          {user ? <>
              <div className="card">
                <Link href="/api/logout">
                  <h3>Logout &rarr;</h3>
                  <p>Sign out of your account</p>
                </Link>
              </div>
              <div className="card">
                <Link href="/join">
                  <h3>Join &rarr;</h3>
                  <p>Join a room</p>
                </Link>
              </div>

              { user.guest || <div className="card">
                <Link href="/dashboard">
                  <h3>Dashboard &rarr;</h3>
                  <p>Visit your dashboard</p>
                </Link>
              </div>}
            </> :
            <div className="card">
              <Link href="/login">
                <h3>Login &rarr;</h3>
                <p>Sign in to an account</p>
              </Link>
            </div>
          }
        </div>
      </main>


    </div>
  )
}