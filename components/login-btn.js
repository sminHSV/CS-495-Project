import useUser from '@/lib/useUser'
import Link from 'next/link'
import styles from '@/styles/LoginBtn.module.css'

export default function LoginBtn() {
  const { data: user } = useUser();

  if (user) {
    return (
      <>
        {user ?
        <>
        <div>Signed in as {user.email} </div>
        <div><Link href='/api/logout'>Logout</Link></div>
        </>: <>
          Not signed in <br />
          <Link href='/login' > Login
          </Link>
        
        </>}
      </>
    )


    
    
  }
  return (
    <>
      
    </>
  )
}