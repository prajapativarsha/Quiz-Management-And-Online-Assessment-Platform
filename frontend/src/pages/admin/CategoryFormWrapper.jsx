import { useParams } from 'react-router-dom';
import CategoryForm from './CategoryForm.jsx';

const CategoryFormWrapper = () => {
  const { id } = useParams(); // Extracts the ID from the URL
  return <CategoryForm categoryId={id} />;
};

export default CategoryFormWrapper;