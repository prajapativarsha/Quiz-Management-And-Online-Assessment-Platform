import { useParams } from 'react-router-dom';
import QuizForm from './QuizForm.jsx';

const QuizFormWrapper = () => {
  const { id } = useParams(); // Extracts the ID from the URL
  return <QuizForm quizId={id} />;
};

export default QuizFormWrapper;