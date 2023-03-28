import useUser from '@/lib/useUser'
import Link from 'next/link'

/**
 * simple button for redirecting the user to the login page.
 * Currently unused.
 */
export default function LoginBtn() {
  const { data: user } = useUser();

  if (user) {
    return (
      <>
        {user ?
        <>
        <div>Signed in as {user.email} </div>
        <div ><Link href='/api/logout'>Logout</Link></div>
        </>: <>
          Not signed in <br />
          <Link href='/login'>Login</Link>
        </>}
      </>
    )
  }
  return (
    <>
      
    </>
  )
}