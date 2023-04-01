import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import useUser from "@/lib/useUser";

export default function Home() {
  const { user } = useUser();

  return (
    <div className={styles.container}>
      <Head>
        <title>UnMute</title>
        <link rel="icon" href="unMuteIcon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.logoWrapper}>
          <img
            src="/unMutelogo/unMuteIconTransparent.png"
            alt="UnMute Icon"
            className={styles.logo}
          />
        </div>

        <div class="topnav">
        <a class="active">Speak Freely, Learn Confidently</a>
        </div>
        <h1 className={styles.title}>
          Welcome to UnMute {user ? user.name : '!'}
        </h1>

        <p className={styles.about}>
          
          UnMute is a platform that provides a safe and anonymous space for students to ask questions and participate in class discussions,
          helping to overcome the barriers that prevent active engagement and promoting a more inclusive learning environment.
        
          </p>
        <div className={styles.grid}>
          {user ? (
            <>
              <div className={styles.card}>
                <Link href="/api/logout">
                  
                    <h3>Logout &rarr;</h3>
                    <p>Sign out of your account</p>
                  
                </Link>
              </div>
              <div className={styles.card}>
                <Link href="/join">
                  
                    <h3>Join &rarr;</h3>
                    <p>Join a room</p>
                  
                </Link>
              </div>

              {!user.guest && (
                <div className={styles.card}>
                  <Link href="/dashboard">
                    
                      <h3>Dashboard &rarr;</h3>
                      <p>Visit your dashboard</p>
                    
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className={styles.card}>
              <Link href="/login">
                  <h3>Login &rarr;</h3>
                  <p>Sign in to an account</p>

              </Link>
            </div>
          )}
<div className={styles.card}>
  <Link href="/register">
    <div>
      <h3>Register &rarr;</h3>
      <p>Register here for a new user</p>
    </div>
  </Link>
</div>

<div className={styles.card}>
  <Link href="/guestLogin">
    <div>
      <h3>Guest Login &rarr;</h3>
      <p>Login as Guest</p>
    </div>
  </Link>
</div>

{/* <div className={styles.card}>
  <Link href="/FAQ">
    <div>
      <h3>FAQs &rarr;</h3>
      <p>Frequently asked questions</p>
    </div>
  </Link>
</div> */}

        </div>
      </main>
    </div>
  );
}
