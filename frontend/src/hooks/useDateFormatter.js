const useDateFormatter = () => {
    const formatDate = (dateString, format = 'YYYY-MM-DD') => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return format === 'ISO' ? date.toISOString().split('T')[0] : date.toLocaleDateString();
    };
  
    return { formatDate };
  };
  
  export default useDateFormatter;
  