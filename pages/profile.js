import { withIronSessionSsr } from "iron-session/next";
import Link from 'next/link'

export default function UserPage ({ user }) {
    return (
        <div>
            <h1>Hello, {user.name}</h1>
            <br />
            <Link href='/api/logout'>Log out</Link>
        </div>
    );
}

export const getServerSideProps = withIronSessionSsr(({ req, res }) => {
    const user = req.session.user;

    if (!user) {
        res.statusCode = 404;
        res.end();
        return { props: {} };
    }

    return {
        props: { user },
    };
}, {
    cookieName: process.env.SITE_COOKIE,
    password: process.env.APPLICATION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});
