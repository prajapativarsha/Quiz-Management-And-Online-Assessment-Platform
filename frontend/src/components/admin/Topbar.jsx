import {useNavigate} from 'react-router-dom';

export default function Topbar({ user, logout }) {
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Welcome, {user?.name}</h2>
      <button className="text-sm text-red-500 hover:underline" onClick={ () => {logout(); {navigate("/")}}}>
        Logout
      </button>
    </header>
  );
}
