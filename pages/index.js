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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
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

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          min-width: 200px;
          margin: 1rem;
          //flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}