import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [accountType, setAccountType] = useState('');
  const [teacher, setTeacher] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState('typing');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (response.ok) {
      return router.push('/login');
    } else {
      let message = (await response.json()).message;
      setErrorMsg(message);
      setStatus('typing');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Select type of account:</legend>
          <div>
            <label>
              Teacher:
              <input
                type="radio"
                name="accountType"
                value="teacher"
                onChange={(e) => setAccountType(e.target.value)}
                disabled={status === 'submitting'}
                checked={accountType === 'teacher'}
              />
            </label>
          </div>
          <div>
            <label>
              Student:
              <input
                type="radio"
                name="accountType"
                value="student"
                onChange={(e) => setAccountType(e.target.value)}
                disabled={status === 'submitting'}
                checked={accountType === 'student'}
              />
            </label>
          </div>
        </fieldset>
        <div>
          <label>
            Email:{' '}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'submitting'}
            />
          </label>
        </div>
        <div>
          <label>
            Name:{' '}
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'submitting'}
            />
          </label>
        </div>
        <div>
          <label>
            Password:{' '}
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'submitting'}
            />
          </label>
        </div>
        <div>
          <button
            disabled={
              email.length === 0 ||
              name.length === 0 ||
              password.length === 0 ||
              status === 'submitting'
            }
            type="submit"
          >
            Register
          </button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
      <br />
      <Link href="/">Go Back</Link>
    </>
  );
}
